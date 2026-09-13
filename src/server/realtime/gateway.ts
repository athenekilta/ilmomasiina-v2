import { createServer } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocket, WebSocketServer } from "ws";
import type { LiveListener } from "./listener";
import {
  MAX_INPUT_BYTES,
  parseClientMessage,
  type DatabaseChange,
  type ServerMessage,
  type Subscription,
} from "./protocol";
import {
  canonicalOrigin,
  requireLiveSecret,
  verifyTicket,
  type LiveTicket,
} from "./ticket";

export type GatewayOptions = {
  listener: LiveListener;
  nextAuthUrl: string;
  secret: string;
  verify?: (
    ticket: string,
    origin: string,
    secret: string,
    now: number,
  ) => LiveTicket | null;
  now?: () => number;
  maxConnections?: number;
  maxBufferedBytes?: number;
  maxPendingChanges?: number;
  coalesceMs?: number;
  heartbeatMs?: number;
  authTimeoutMs?: number;
  closeGraceMs?: number;
  messageBurst?: number;
  messagesPerSecond?: number;
  upgradeBurst?: number;
  upgradesPerSecond?: number;
};

type Peer = {
  socket: WebSocket;
  identity?: LiveTicket;
  subscription?: Subscription;
  pending: Map<string, ServerMessage>;
  needsResync: boolean;
  alive: boolean;
  closing: boolean;
  tokens: number;
  lastRefill: number;
  authTimer?: ReturnType<typeof setTimeout>;
  closeTimer?: ReturnType<typeof setTimeout>;
};

export function createGateway(options: GatewayOptions) {
  const origin = canonicalOrigin(options.nextAuthUrl);
  const secret = requireLiveSecret(options.secret);
  const listener = options.listener;
  const now = options.now ?? Date.now;
  const peers = new Set<Peer>();
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: MAX_INPUT_BYTES,
    perMessageDeflate: false,
  });
  let stopped = false;
  let needsFreshTickets = !listener.ready;
  // Listener outages invalidate every previously issued ticket. User-specific
  // watermarks prevent one account's auth activity from rejecting unrelated or
  // anonymous clients; entries cannot outlive the maximum ticket lifetime.
  let listenerTicketCutoff = 0;
  const userTicketCutoffs = new Map<string, number>();
  let upgradeTokens = options.upgradeBurst ?? 200;
  let lastUpgradeRefill = now();

  const http = createServer((req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(listener.ready && !stopped ? 200 : 503, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ ready: listener.ready && !stopped }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  http.headersTimeout = 10_000;
  http.requestTimeout = 10_000;
  http.keepAliveTimeout = 5000;
  http.maxConnections = (options.maxConnections ?? 2000) + 64;

  function close(peer: Peer, code: number, reason: string) {
    if (peer.closing) return;
    peer.closing = true;
    peer.pending.clear();
    peer.subscription = undefined;
    if (peer.authTimer) clearTimeout(peer.authTimer);
    peer.socket.close(code, reason);
    peer.closeTimer = setTimeout(
      () => peer.socket.terminate(),
      options.closeGraceMs ?? 1000,
    );
    peer.closeTimer.unref();
  }

  function send(peer: Peer, message: ServerMessage) {
    if (peer.closing || peer.socket.readyState !== WebSocket.OPEN) return;
    const text = JSON.stringify(message);
    if (
      peer.socket.bufferedAmount + Buffer.byteLength(text) >
      (options.maxBufferedBytes ?? 65_536)
    ) {
      close(peer, 1013, "Slow consumer; resync required");
      return;
    }
    peer.socket.send(text, (error) => {
      if (error) peer.socket.terminate();
    });
  }

  function reauthenticate(peer: Peer) {
    send(peer, { type: "reauthenticate" });
    close(peer, 4401, "Fetch a fresh live ticket");
  }

  function authorized(peer: Peer): peer is Peer & { identity: LiveTicket } {
    if (!peer.identity || peer.closing) return false;
    if (peer.identity.expiresAt <= now()) {
      reauthenticate(peer);
      return false;
    }
    return true;
  }

  function queue(peer: Peer, key: string, message: ServerMessage) {
    if (peer.needsResync) return;
    if (
      !peer.pending.has(key) &&
      peer.pending.size >= (options.maxPendingChanges ?? 128)
    ) {
      peer.pending.clear();
      peer.needsResync = true;
    } else {
      peer.pending.set(key, message);
    }
  }

  const onChange = (change: DatabaseChange) => {
    if (!listener.ready || stopped) return;
    if ("userId" in change) {
      const cutoff = now();
      userTicketCutoffs.set(change.userId, cutoff);
      for (const [userId, issuedAt] of userTicketCutoffs) {
        if (issuedAt < cutoff - 60_000) userTicketCutoffs.delete(userId);
      }
      for (const peer of peers) {
        if (!authorized(peer)) continue;
        if (peer.identity.userId === change.userId) {
          reauthenticate(peer);
        } else if (
          peer.subscription?.users &&
          peer.identity.role === "superadmin"
        ) {
          queue(peer, "users", { type: "change", kind: "users" });
        }
      }
      return;
    }
    for (const peer of peers) {
      if (!authorized(peer) || !peer.subscription) continue;
      const privateAccess =
        peer.identity.role === "event_editor" ||
        peer.identity.role === "superadmin";
      if (!change.public && !privateAccess) continue;
      if (
        !peer.subscription.events &&
        !peer.subscription.eventIds.includes(change.eventId)
      )
        continue;
      queue(peer, `${change.kind}:${change.eventId}`, {
        type: "change",
        kind: change.kind,
        eventId: change.eventId,
      });
    }
  };
  const onUnavailable = () => {
    needsFreshTickets = true;
    listenerTicketCutoff = Math.max(listenerTicketCutoff, now());
    for (const peer of peers)
      close(peer, 1013, "Database listener unavailable");
  };
  const onReady = () => {
    if (needsFreshTickets)
      listenerTicketCutoff = Math.max(listenerTicketCutoff, now());
    needsFreshTickets = false;
    for (const peer of peers) {
      if (authorized(peer) && peer.subscription) {
        peer.pending.clear();
        peer.needsResync = false;
        send(peer, { type: "resync" });
      }
    }
  };
  listener.on("change", onChange);
  listener.on("unavailable", onUnavailable);
  listener.on("ready", onReady);

  function reject(socket: Duplex, status: number, reason: string) {
    socket.end(
      `HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
      () => socket.destroy(),
    );
  }
  http.on("upgrade", (req, socket, head) => {
    socket.on("error", () => socket.destroy());
    // Origin is preserved by the same-origin Next proxy. Neither Host nor any
    // forwarded header grants access, and tickets are never accepted in a URL.
    if (req.url !== "/api/live") return reject(socket, 404, "Not Found");
    if (req.headers.origin !== origin) return reject(socket, 403, "Forbidden");
    if (!listener.ready || stopped)
      return reject(socket, 503, "Service Unavailable");
    const time = now();
    upgradeTokens = Math.min(
      options.upgradeBurst ?? 200,
      upgradeTokens +
        (Math.max(0, time - lastUpgradeRefill) *
          (options.upgradesPerSecond ?? 50)) /
          1000,
    );
    lastUpgradeRefill = time;
    if (peers.size >= (options.maxConnections ?? 2000) || upgradeTokens < 1)
      return reject(socket, 503, "Service Unavailable");
    upgradeTokens--;
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
  });

  wss.on("connection", (socket: WebSocket) => {
    const peer: Peer = {
      socket,
      pending: new Map(),
      needsResync: false,
      alive: true,
      closing: false,
      tokens: options.messageBurst ?? 20,
      lastRefill: now(),
    };
    peers.add(peer);
    peer.authTimer = setTimeout(
      () => reauthenticate(peer),
      options.authTimeoutMs ?? 5000,
    );
    peer.authTimer.unref();
    const consume = () => {
      if (peer.closing) return false;
      const time = now();
      peer.tokens = Math.min(
        options.messageBurst ?? 20,
        peer.tokens +
          (Math.max(0, time - peer.lastRefill) *
            (options.messagesPerSecond ?? 5)) /
            1000,
      );
      peer.lastRefill = time;
      if (peer.tokens < 1) {
        close(peer, 1008, "Message rate exceeded");
        return false;
      }
      peer.tokens--;
      return true;
    };
    socket.on("pong", () => {
      if (consume()) peer.alive = true;
    });
    socket.on("ping", () => {
      consume();
    });
    socket.on("error", () => socket.terminate());
    socket.on("close", () => {
      if (peer.authTimer) clearTimeout(peer.authTimer);
      if (peer.closeTimer) clearTimeout(peer.closeTimer);
      peers.delete(peer);
    });
    socket.on("message", (data, binary) => {
      if (!consume()) return;
      const message = binary ? null : parseClientMessage(data.toString());
      if (!message) return close(peer, 1008, "Invalid live message");
      if (message.type === "authenticate") {
        // Renewal uses a new socket, avoiding old subscriptions surviving a role change.
        if (peer.identity) return close(peer, 1008, "Already authenticated");
        const identity = (options.verify ?? verifyTicket)(
          message.ticket,
          origin,
          secret,
          now(),
        );
        if (
          !identity ||
          identity.issuedAt <= listenerTicketCutoff ||
          (identity.userId !== null &&
            identity.issuedAt <=
              (userTicketCutoffs.get(identity.userId) ?? 0)) ||
          identity.expiresAt <= now()
        )
          return reauthenticate(peer);
        peer.identity = identity;
        if (peer.authTimer) clearTimeout(peer.authTimer);
        peer.authTimer = setTimeout(
          () => reauthenticate(peer),
          identity.expiresAt - now(),
        );
        peer.authTimer.unref();
        return;
      }
      if (!authorized(peer)) {
        if (!peer.closing) reauthenticate(peer);
        return;
      }
      peer.subscription = {
        ...message,
        users: message.users && peer.identity.role === "superadmin",
        profile: message.profile && peer.identity.userId !== null,
      };
      peer.pending.clear();
      peer.needsResync = false;
      // The caller refetches after ready, covering the subscribe/snapshot race.
      send(peer, { type: "ready" });
    });
  });

  const flush = setInterval(() => {
    for (const peer of peers) {
      if (!authorized(peer) || !peer.subscription) continue;
      if (peer.needsResync) send(peer, { type: "resync" });
      else for (const message of peer.pending.values()) send(peer, message);
      peer.pending.clear();
      peer.needsResync = false;
    }
  }, options.coalesceMs ?? 150);
  flush.unref();
  const heartbeat = setInterval(() => {
    for (const peer of peers) {
      if (peer.closing) continue;
      if (!peer.alive) {
        peer.socket.terminate();
        continue;
      }
      peer.alive = false;
      peer.socket.ping();
    }
  }, options.heartbeatMs ?? 30_000);
  heartbeat.unref();

  return {
    http,
    async listen(port = 3001, host = "127.0.0.1") {
      await new Promise<void>((resolve, reject) => {
        const onError = (error: Error) => {
          http.off("listening", onListening);
          reject(error);
        };
        const onListening = () => {
          http.off("error", onError);
          resolve();
        };
        http.once("error", onError);
        http.once("listening", onListening);
        http.listen(port, host);
      });
      listener.start();
      return http.address();
    },
    async close() {
      if (stopped) return;
      stopped = true;
      clearInterval(flush);
      clearInterval(heartbeat);
      listener.off("change", onChange);
      listener.off("unavailable", onUnavailable);
      listener.off("ready", onReady);
      for (const peer of peers) {
        if (peer.authTimer) clearTimeout(peer.authTimer);
        if (peer.closeTimer) clearTimeout(peer.closeTimer);
        peer.socket.terminate();
      }
      await Promise.all([
        listener.stop(),
        new Promise<void>((resolve) => wss.close(() => resolve())),
        new Promise<void>((resolve) => http.close(() => resolve())),
      ]);
    },
  };
}
