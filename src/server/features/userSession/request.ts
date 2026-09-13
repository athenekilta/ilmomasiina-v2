import { createHash, randomBytes } from "node:crypto";
import { TRPCError } from "@trpc/server";
import type { NextApiRequest, NextApiResponse } from "next";

/** Server-only mutable state. Never return this object from a procedure. */
export type UserSessionContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  rawSessionToken?: string;
  pendingSession?: Promise<{
    id: string;
    name: string | null;
    email: string | null;
    expiresAt: Date;
  }>;
};

export function duration(
  name: string,
  fallback: number,
  maximum: number,
): number {
  const value = process.env[name];
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0 || parsed > maximum)
    throw new Error(
      `${name} must be an integer between 1 and ${maximum} seconds`,
    );
  return parsed;
}

export function trustedOrigin(): string {
  const url = new URL(
    process.env.USER_SESSION_ORIGIN ?? process.env.NEXTAUTH_URL ?? "",
  );
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (process.env.NODE_ENV === "production" && url.protocol !== "https:")
  )
    throw new Error(
      "User sessions require a trusted HTTP(S) origin (HTTPS in production)",
    );
  return url.origin;
}

export function assertUserSessionOrigin(
  access: UserSessionContext | undefined,
): asserts access is UserSessionContext {
  if (
    !access ||
    access.req.method !== "POST" ||
    access.req.headers.origin !== trustedOrigin()
  )
    throw new TRPCError({ code: "FORBIDDEN", message: "User session denied" });
}

export const newToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const isToken = (token: unknown): token is string =>
  typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
export const cookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Host-user-session"
    : "user-session";

export function createUserSessionContext(
  req: NextApiRequest,
  res: NextApiResponse,
): UserSessionContext {
  const token = req.cookies[cookieName()];
  return { req, res, rawSessionToken: isToken(token) ? token : undefined };
}

export function setSessionCookie(
  access: UserSessionContext,
  token: string | undefined,
  expiresAt?: Date,
) {
  const cookie = `${cookieName()}=${token ?? ""}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}; ${token && expiresAt ? `Expires=${expiresAt.toUTCString()}` : "Max-Age=0"}`;
  const previous = access.res.getHeader("Set-Cookie");
  const cookies =
    previous === undefined
      ? []
      : Array.isArray(previous)
        ? previous.map(String)
        : [String(previous)];
  // Preserve Better Auth and any other response cookies, replacing only ours.
  access.res.setHeader("Set-Cookie", [
    ...cookies.filter((value) => !value.startsWith(`${cookieName()}=`)),
    cookie,
  ]);
  access.rawSessionToken = token;
}

export function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (
    !normalized ||
    normalized.length > 320 ||
    !/^[^\s@]+@[^\s@]+$/.test(normalized)
  )
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid email" });
  return normalized;
}
