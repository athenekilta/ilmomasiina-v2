import { TRPCError } from "@trpc/server";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/server/external/prisma";
import cuid from "cuid";
import {
  assertUserSessionOrigin,
  duration,
  hashToken,
  isToken,
  newToken,
  normalizeEmail,
  setSessionCookie,
  trustedOrigin,
  type UserSessionContext,
} from "./request";

export { assertUserSessionOrigin } from "./request";
export type { UserSessionContext } from "./request";

type DB = Prisma.TransactionClient | PrismaClient;
export type UserSession = {
  id: string;
  name: string | null;
  email: string | null;
  expiresAt: Date;
};

const after = (seconds: number) => new Date(Date.now() + seconds * 1000);
const sessionExpiry = () =>
  after(duration("USER_SESSION_SECONDS", 30 * 86400, 365 * 86400));
const accessDenied = () =>
  new TRPCError({ code: "UNAUTHORIZED", message: "Signup access denied" });

export async function getUserSession(
  db: DB,
  access: UserSessionContext | undefined,
): Promise<UserSession | null> {
  if (!isToken(access?.rawSessionToken)) return null;
  return db.userSession.findFirst({
    where: {
      tokenHash: hashToken(access.rawSessionToken),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { id: true, name: true, email: true, expiresAt: true },
  });
}

export async function ensureUserSession(
  access: UserSessionContext | undefined,
): Promise<UserSession> {
  assertUserSessionOrigin(access);
  access.pendingSession ??= (async () => {
    const existing = await getUserSession(prisma, access);
    if (existing) return existing;

    const id = cuid();
    const token = newToken();
    const expiresAt = sessionExpiry();
    await prisma.$transaction(async (tx) => {
      if (isToken(access.rawSessionToken)) {
        await tx.userSession.deleteMany({
          where: { tokenHash: hashToken(access.rawSessionToken) },
        });
      }
      await tx.userSession.create({
        data: { id, tokenHash: hashToken(token), expiresAt },
      });
    });
    setSessionCookie(access, token, expiresAt);
    return { id, name: null, email: null, expiresAt };
  })();
  return access.pendingSession;
}

export async function rotateUserSession(
  access: UserSessionContext | undefined,
  identity: { name: string; email: string } | null,
): Promise<UserSession> {
  assertUserSessionOrigin(access);
  const token = newToken();
  const session: UserSession = {
    id: cuid(),
    name: identity?.name.trim() || null,
    email: identity ? normalizeEmail(identity.email) : null,
    expiresAt: sessionExpiry(),
  };

  await prisma.$transaction(async (tx) => {
    await tx.userSession.create({
      data: {
        ...session,
        tokenHash: hashToken(token),
      },
    });
    if (isToken(access.rawSessionToken)) {
      await tx.userSession.deleteMany({
        where: { tokenHash: hashToken(access.rawSessionToken) },
      });
    }
  });

  setSessionCookie(access, token, session.expiresAt);
  access.pendingSession = Promise.resolve(session);
  return session;
}

export async function setUserSessionIdentity(
  access: UserSessionContext | undefined,
  identity: { name: string; email: string },
): Promise<UserSession> {
  assertUserSessionOrigin(access);
  const email = normalizeEmail(identity.email);
  const existing = await getUserSession(prisma, access);

  if (!existing || existing.email !== email) {
    return rotateUserSession(access, { ...identity, email });
  }

  await updateUserIdentity(prisma, existing, { ...identity, email });
  access.pendingSession = Promise.resolve(existing);
  return existing;
}

export async function grantCreatedSignup(
  tx: Prisma.TransactionClient,
  session: UserSession,
  signupId: string,
): Promise<void> {
  await tx.signupGrant.upsert({
    where: { signupId },
    update: { sessions: { connect: { id: session.id } } },
    create: {
      id: cuid(),
      signupId,
      sessions: { connect: { id: session.id } },
    },
  });
}

export async function updateUserIdentity(
  db: DB,
  session: UserSession,
  identity: { name: string; email: string } | null,
): Promise<void> {
  const name = identity?.name.trim() || null;
  const email = identity ? normalizeEmail(identity.email) : null;
  await db.userSession.updateMany({
    where: {
      id: session.id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { name, email },
  });
  session.name = name;
  session.email = email;
}

export async function canAccessSignup(
  db: DB,
  access: UserSessionContext | undefined,
  signup: { id: string },
): Promise<boolean> {
  if (!isToken(access?.rawSessionToken)) return false;
  const session = await db.userSession.findFirst({
    where: {
      tokenHash: hashToken(access.rawSessionToken),
      revokedAt: null,
      expiresAt: { gt: new Date() },
      OR: [
        { signupGrants: { some: { signupId: signup.id } } },
        {
          identityGrants: {
            some: { identity: { signups: { some: { id: signup.id } } } },
          },
        },
      ],
    },
    select: { id: true },
  });
  return session !== null;
}

export async function requireUserSignupAccess(
  db: DB,
  access: UserSessionContext | undefined,
  signup: { id: string },
): Promise<void> {
  if (!(await canAccessSignup(db, access, signup))) throw accessDenied();
}

export async function createSignupEditUrl(signupId: string): Promise<string> {
  const signup = await prisma.signup.findUnique({
    where: { id: signupId },
    select: { Quota: { select: { eventId: true } } },
  });
  if (!signup) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Signup not found" });
  }

  const rawToken = newToken();
  const expiresAt = after(
    duration("SIGNUP_TOKEN_SECONDS", 365 * 86400, 5 * 365 * 86400),
  );
  await prisma.$transaction(async (tx) => {
    const grant = await tx.signupGrant.upsert({
      where: { signupId },
      update: {},
      create: { id: cuid(), signupId },
    });
    await tx.token.create({
      data: {
        id: cuid(),
        tokenHash: hashToken(rawToken),
        signupGrantId: grant.id,
        expiresAt,
      },
    });
  });
  return `${trustedOrigin()}/events/${signup.Quota.eventId}/${encodeURIComponent(signupId)}#token=${rawToken}`;
}

export async function redeemToken(
  access: UserSessionContext | undefined,
  token: string,
) {
  assertUserSessionOrigin(access);
  if (!isToken(token)) throw accessDenied();

  const rawSessionToken = newToken();
  const result = await prisma.$transaction(async (tx) => {
    const credential = await tx.token.findFirst({
      where: {
        tokenHash: hashToken(token),
        expiresAt: { gt: new Date() },
        consumedAt: null,
        signupGrantId: { not: null },
        identityGrantId: null,
      },
      include: {
        signupGrant: {
          include: {
            signup: {
              select: {
                name: true,
                identity: { select: { email: true } },
                Quota: { select: { eventId: true } },
              },
            },
          },
        },
      },
    });
    const grant = credential?.signupGrant;
    if (!grant) throw accessDenied();

    const session: UserSession = {
      id: cuid(),
      name: grant.signup.name,
      email: normalizeEmail(grant.signup.identity.email),
      expiresAt: sessionExpiry(),
    };
    await tx.userSession.create({
      data: {
        id: session.id,
        tokenHash: hashToken(rawSessionToken),
        name: session.name,
        email: session.email,
        expiresAt: session.expiresAt,
        signupGrants: { connect: { id: grant.id } },
      },
    });
    if (isToken(access.rawSessionToken)) {
      await tx.userSession.deleteMany({
        where: { tokenHash: hashToken(access.rawSessionToken) },
      });
    }
    return {
      session,
      redirectUrl: `/events/${grant.signup.Quota.eventId}/${encodeURIComponent(grant.signupId)}`,
    };
  });

  setSessionCookie(access, rawSessionToken, result.session.expiresAt);
  access.pendingSession = undefined;
  return { redirectUrl: result.redirectUrl };
}

export async function revokeToken(tokenId: string): Promise<void> {
  await prisma.token.deleteMany({ where: { id: tokenId } });
}

export async function logoutUserSession(
  access: UserSessionContext | undefined,
): Promise<void> {
  assertUserSessionOrigin(access);
  if (isToken(access.rawSessionToken)) {
    await prisma.userSession.deleteMany({
      where: { tokenHash: hashToken(access.rawSessionToken) },
    });
  }
  setSessionCookie(access, undefined);
  access.pendingSession = undefined;
}

export async function cleanupUserSessions(): Promise<void> {
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.token.deleteMany({ where: { expiresAt: { lte: now } } });
    await tx.userSession.deleteMany({
      where: { OR: [{ expiresAt: { lte: now } }, { revokedAt: { not: null } }] },
    });
    await tx.identity.deleteMany({
      where: { signups: { none: {} }, grants: { none: {} } },
    });
  });
}
