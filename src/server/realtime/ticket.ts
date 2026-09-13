import { createHmac, timingSafeEqual } from "node:crypto";
import { MAX_TICKET_BYTES, type LiveRole } from "./protocol";

export const TICKET_TTL_MS = 60_000;
export type LiveIdentity = { userId: string | null; role: LiveRole | null };
export type LiveTicket = LiveIdentity & {
  version: 1;
  audience: "ilmomasiina-live";
  origin: string;
  issuedAt: number;
  expiresAt: number;
};

export function canonicalOrigin(nextAuthUrl: string | undefined): string {
  if (!nextAuthUrl)
    throw new Error("NEXTAUTH_URL is required for live updates");
  const url = new URL(nextAuthUrl);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("NEXTAUTH_URL must be an HTTP(S) URL without credentials");
  }
  return url.origin;
}

export function requireLiveSecret(secret: string | undefined): string {
  if (!secret) throw new Error("NEXTAUTH_SECRET is required for live updates");
  return secret;
}

export function isLiveRole(role: unknown): role is LiveRole {
  return role === "user" || role === "event_editor" || role === "superadmin";
}

export function issueTicket(
  identity: LiveIdentity,
  origin: string,
  secret: string,
  now = Date.now(),
  expiresAt = now + TICKET_TTL_MS,
): { ticket: string; expiresAt: number } {
  expiresAt = Math.min(expiresAt, now + TICKET_TTL_MS);
  const claims: LiveTicket = {
    ...identity,
    version: 1,
    audience: "ilmomasiina-live",
    origin,
    issuedAt: now,
    expiresAt,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const signature = createHmac("sha256", requireLiveSecret(secret))
    .update(payload)
    .digest("base64url");
  return { ticket: `${payload}.${signature}`, expiresAt };
}

export function verifyTicket(
  token: string,
  origin: string,
  secret: string,
  now = Date.now(),
): LiveTicket | null {
  if (token.length > MAX_TICKET_BYTES) return null;
  const parts = token.split(".");
  const [payload, signature] = parts;
  if (
    parts.length !== 2 ||
    !payload ||
    !signature ||
    !/^[\w-]+$/.test(payload) ||
    !/^[\w-]{43}$/.test(signature)
  )
    return null;
  const expected = createHmac("sha256", requireLiveSecret(secret))
    .update(payload)
    .digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null;
  try {
    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as LiveTicket;
    if (
      !claims ||
      claims.version !== 1 ||
      claims.audience !== "ilmomasiina-live" ||
      claims.origin !== origin ||
      !Number.isSafeInteger(claims.issuedAt) ||
      !Number.isSafeInteger(claims.expiresAt) ||
      claims.issuedAt > now ||
      claims.expiresAt <= now ||
      claims.expiresAt <= claims.issuedAt ||
      claims.expiresAt - claims.issuedAt > TICKET_TTL_MS
    )
      return null;
    if (claims.userId === null && claims.role === null) return claims;
    if (
      typeof claims.userId === "string" &&
      claims.userId.length > 0 &&
      claims.userId.length <= 256 &&
      isLiveRole(claims.role)
    )
      return claims;
  } catch {
    /* Invalid claims are never authenticated. */
  }
  return null;
}
