import { env } from "@/env/client.mjs";
import {
  notifyManager,
  type Query,
  type QueryClient,
} from "@tanstack/react-query";
import {
  collectScope,
  describeQuery,
  isPrivilegedQuery,
  isRealtimeQuery,
  isRecord,
  matchesChange,
  parseChange,
  privilegesChanged,
  profileIdentity,
  type LiveChange,
} from "./queries";

const COALESCE_MS = 150;
const POLL_MS = 30_000;
const HANDSHAKE_MS = 10_000;
const BADGE_GRACE_MS = 5_000;

type Predicate = (query: Query) => boolean;

export function clearRealtimeData(client: QueryClient, predicate: Predicate) {
  notifyManager.batch(() => {
    for (const query of client.getQueryCache().getAll()) {
      if (!predicate(query)) continue;
      if (query.getObserversCount() === 0) {
        client.removeQueries({ queryKey: query.queryKey, exact: true });
      } else {
        // Removing an observed query leaves its observers holding the old data.
        // reset() cancels in-flight work; explicitly clear data because its
        // initial state can itself contain privileged SSR hydration data.
        query.reset();
        query.setState({
          data: undefined,
          dataUpdatedAt: 0,
          error: null,
          errorUpdatedAt: 0,
          status: "pending",
          fetchStatus: "idle",
          isInvalidated: true,
        });
      }
    }
  });
}

/** One instance, owned by the app. No router or signup credentials are used. */
export function startRealtime(
  client: QueryClient,
  showDisconnected: (show: boolean) => void,
) {
  const cache = client.getQueryCache();
  let disposed = false;
  let socket: WebSocket | undefined;
  let bootstrap: AbortController | undefined;
  let generation = 0;
  let ready = false;
  let attempts = 0;
  let sentScope = "";
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  let badgeTimer: ReturnType<typeof setTimeout> | undefined;
  let scopeTimer: ReturnType<typeof setTimeout> | undefined;
  let flushTimer: ReturnType<typeof setTimeout> | undefined;
  let pollBusy = false;
  let fullResync = false;
  let refreshPromise: Promise<void> | undefined;
  let pendingRefreshes: Predicate[] = [];
  let pendingForcedCancellation = false;
  const changes = new Map<string, LiveChange>();
  const getProfile = () =>
    profileIdentity(
      cache
        .getAll()
        .find((query) => describeQuery(query.queryKey).path === "profile.get")
        ?.state.data,
    );
  let lastProfile = getProfile();

  function canRefetch(query: Query) {
    if (!query.isActive() || query.isDisabled()) return false;
    if (!isPrivilegedQuery(query)) return true;
    const role = getProfile()?.role;
    return describeQuery(query.queryKey).path === "users.getUsers"
      ? role === "superadmin"
      : role === "superadmin" || role === "event_editor";
  }

  function invalidate(predicate: Predicate, forceCancellation = false) {
    pendingRefreshes.push(predicate);
    pendingForcedCancellation ||= forceCancellation;
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      while (!disposed && pendingRefreshes.length > 0) {
        const predicates = pendingRefreshes;
        const cancel = pendingForcedCancellation;
        pendingRefreshes = [];
        pendingForcedCancellation = false;
        const matches = (query: Query) =>
          predicates.some((candidate) => candidate(query));

        // Only an initial/reconnected snapshot must supersede a fetch that may
        // have started before the subscription. Ordinary notifications are
        // serialized so sustained traffic cannot repeatedly cancel responses.
        if (cancel) {
          await client.cancelQueries({
            predicate: (query) => matches(query) && canRefetch(query),
          });
        }
        if (disposed) return;
        // Include inactive and disabled entries in stale marking, but never fetch
        // them (CSV exports in particular are intentionally enabled:false).
        await client.invalidateQueries({
          predicate: matches,
          refetchType: "none",
        });
        if (!disposed) {
          await client.refetchQueries(
            {
              predicate: (query) => matches(query) && canRefetch(query),
              type: "active",
            },
            { cancelRefetch: false },
          );
        }
      }
    })().finally(() => {
      refreshPromise = undefined;
      if (!disposed && pendingRefreshes.length > 0)
        void invalidate(() => false);
    });
    return refreshPromise;
  }

  function enqueueResync() {
    fullResync = true;
    scheduleFlush();
  }

  function scheduleFlush() {
    if (flushTimer !== undefined || disposed) return;
    flushTimer = setTimeout(() => {
      flushTimer = undefined;
      const resync = fullResync;
      const batch = [...changes.values()];
      fullResync = false;
      changes.clear();
      void invalidate(
        (query) =>
          resync
            ? isRealtimeQuery(query)
            : batch.some((change) => matchesChange(query, change)),
        resync,
      );
    }, COALESCE_MS);
  }

  function disconnected() {
    ready = false;
    // Ticket rotation is normally quick; do not flash an outage badge or
    // discard cached data just because a ticket reached its expiry time.
    if (badgeTimer === undefined) {
      badgeTimer = setTimeout(() => {
        badgeTimer = undefined;
        if (!disposed && !ready) showDisconnected(true);
      }, BADGE_GRACE_MS);
    }
  }

  function closeTransport() {
    generation += 1;
    clearTimeout(deadline);
    deadline = undefined;
    bootstrap?.abort();
    bootstrap = undefined;
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.close();
      socket = undefined;
    }
    sentScope = "";
    disconnected();
  }

  function retry(immediate = false) {
    if (disposed) return;
    closeTransport();
    clearTimeout(retryTimer);
    retryTimer = undefined;
    if (!navigator.onLine) return;
    const ceiling = Math.min(30_000, 1_000 * 2 ** Math.min(attempts++, 5));
    const delay = immediate
      ? 100 + Math.random() * 200
      : ceiling * (0.5 + Math.random() * 0.5);
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      void connect();
    }, delay);
  }

  function sendSubscription() {
    if (socket?.readyState !== WebSocket.OPEN) return;
    const scope = collectScope(cache.getAll());
    const serialized = JSON.stringify(scope);
    if (serialized === sentScope) return;
    sentScope = serialized;
    socket.send(JSON.stringify({ type: "subscribe", ...scope }));
  }

  async function connect() {
    if (disposed || !navigator.onLine) return;
    closeTransport();
    const current = generation;
    const controller = new AbortController();
    bootstrap = controller;
    deadline = setTimeout(() => retry(), HANDSHAKE_MS);
    try {
      const response = await fetch("/api/live-session", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Live session bootstrap failed");
      const payload: unknown = await response.json();
      if (disposed || current !== generation) return;
      if (
        !isRecord(payload) ||
        typeof payload.ticket !== "string" ||
        !payload.ticket
      ) {
        throw new Error("Invalid live session ticket");
      }
      bootstrap = undefined;
      const url = env.NEXT_PUBLIC_LIVE_URL
        ? new URL(env.NEXT_PUBLIC_LIVE_URL)
        : new URL("/api/live", window.location.href);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      // Next's development upgrade proxy shares machinery with HMR and is not
      // reliable for an additional WebSocket. Bypass it by using the gateway's
      // default local port unless an explicit public URL was configured.
      if (
        !env.NEXT_PUBLIC_LIVE_URL &&
        process.env.NODE_ENV === "development"
      ) {
        url.port = "3001";
      }
      // The gateway owns liveness detection using native ping/pong frames;
      // browsers answer those automatically (there is no JSON heartbeat).
      const ws = new WebSocket(url);
      socket = ws;
      const isCurrent = () =>
        !disposed && current === generation && socket === ws;
      ws.onopen = () => {
        if (!isCurrent()) return;
        ws.send(
          JSON.stringify({ type: "authenticate", ticket: payload.ticket }),
        );
        sendSubscription();
      };
      ws.onmessage = (event: MessageEvent) => {
        if (!isCurrent() || typeof event.data !== "string") return;
        let message: unknown;
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!isRecord(message)) return;
        switch (message.type) {
          case "ready":
            ready = true;
            attempts = 0;
            clearTimeout(deadline);
            deadline = undefined;
            clearTimeout(badgeTimer);
            badgeTimer = undefined;
            showDisconnected(false);
            enqueueResync();
            break;
          case "resync":
            enqueueResync();
            break;
          case "reauthenticate":
            enqueueResync();
            retry(ready);
            break;

          case "change": {
            const change = parseChange(message);
            if (!change) return;
            const key =
              "eventId" in change
                ? `${change.kind}:${change.eventId}`
                : change.kind;
            changes.set(key, change);
            scheduleFlush();
            break;
          }
        }
      };
      ws.onclose = (event) => {
        if (!isCurrent()) return;
        if (event.code === 4401) enqueueResync();
        retry(event.code === 4401 && ready);
      };
      ws.onerror = () => {
        if (isCurrent()) retry();
      };
    } catch {
      if (!disposed && current === generation) retry();
    }
  }

  const unsubscribe = cache.subscribe((event) => {
    if (disposed) return;
    if (
      event.type === "updated" &&
      event.action.type === "success" &&
      describeQuery(event.query.queryKey).path === "profile.get"
    ) {
      const next = profileIdentity(event.query.state.data);
      const changed = privilegesChanged(lastProfile, next);
      lastProfile = next;
      if (changed) {
        clearRealtimeData(client, isPrivilegedQuery);
        enqueueResync();
        retry(true);
      }
    }
    // Observer-added/removed/options-updated events cover sidebars, disabled
    // queries becoming enabled, and navigation without depending on the URL.
    if (scopeTimer === undefined) {
      scopeTimer = setTimeout(() => {
        scopeTimer = undefined;
        sendSubscription();
      }, 0);
    }
  });

  function resume() {
    if (document.visibilityState === "hidden") return;
    enqueueResync();
    if (!ready && !socket && !bootstrap) {
      clearTimeout(retryTimer);
      retryTimer = undefined;
      void connect();
    }
  }
  function offline() {
    clearTimeout(retryTimer);
    retryTimer = undefined;
    closeTransport();
  }
  window.addEventListener("online", resume);
  window.addEventListener("offline", offline);
  window.addEventListener("focus", resume);
  document.addEventListener("visibilitychange", resume);

  const pollTimer = setInterval(() => {
    if (
      ready ||
      pollBusy ||
      !navigator.onLine ||
      document.visibilityState === "hidden"
    )
      return;
    pollBusy = true;
    void invalidate(isRealtimeQuery).finally(() => {
      pollBusy = false;
    });
  }, POLL_MS);
  disconnected();
  void connect();

  return () => {
    disposed = true;
    unsubscribe();
    window.removeEventListener("online", resume);
    window.removeEventListener("offline", offline);
    window.removeEventListener("focus", resume);
    document.removeEventListener("visibilitychange", resume);
    closeTransport();
    clearTimeout(retryTimer);
    clearTimeout(badgeTimer);
    clearTimeout(scopeTimer);
    clearTimeout(flushTimer);
    clearInterval(pollTimer);
  };
}
