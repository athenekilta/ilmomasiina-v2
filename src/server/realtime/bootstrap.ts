import type { NextApiRequest, NextApiResponse } from "next";
import {
  canonicalOrigin,
  issueTicket,
  requireLiveSecret,
  type LiveIdentity,
} from "./ticket";

export type BootstrapDependencies = {
  config: () => { nextAuthUrl: string | undefined; secret: string | undefined };
  identity: (
    req: NextApiRequest,
  ) => Promise<(LiveIdentity & { expiresAt?: number }) | null>;
  now?: () => number;
};

// A global bound is intentional: the gateway sits behind a proxy, and arbitrary
// forwarded IP headers must not become a way to bypass limits or origin checks.
export function createLiveSessionHandler(dependencies: BootstrapDependencies) {
  const now = dependencies.now ?? Date.now;
  let inFlight = 0;
  let tokens = 120;
  let lastRefill = now();
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Vary", "Cookie, Origin");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.status(405).end();
      return;
    }
    try {
      const config = dependencies.config();
      const origin = canonicalOrigin(config.nextAuthUrl);
      const secret = requireLiveSecret(config.secret);
      if (req.headers.origin !== origin) {
        res.status(403).end();
        return;
      }
      const issuedAt = now();
      tokens = Math.min(
        120,
        tokens + Math.max(0, issuedAt - lastRefill) * 0.03,
      );
      lastRefill = issuedAt;
      if (tokens < 1 || inFlight >= 32) {
        res.setHeader("Retry-After", "1");
        res.status(429).end();
        return;
      }
      tokens--;
      inFlight++;
      try {
        // Stamp before the auth read so a concurrent revocation invalidates this
        // ticket even if the database lookup finishes after its notification.
        const identity = await dependencies.identity(req);
        if (identity?.expiresAt !== undefined && identity.expiresAt <= now()) {
          res.status(401).end();
          return;
        }
        const result = issueTicket(
          identity ?? { userId: null, role: null },
          origin,
          secret,
          issuedAt,
          identity?.expiresAt,
        );
        if (result.expiresAt <= now()) {
          res.status(503).end();
          return;
        }
        res.status(200).json(result);
      } finally {
        inFlight--;
      }
    } catch {
      // Never turn failed session/database lookups into an authenticated ticket.
      res.status(503).end();
    }
  };
}
