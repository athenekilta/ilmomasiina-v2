import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerManagementSession } from "../common/get-server-management-session";
import { prisma } from "../external/prisma";
import cuid from "cuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { mail } from "../external/mail";
import { fromNodeHeaders } from "better-auth/node";
import type { ManagementSession } from "@/server/auth";
import { createUserSessionContext } from "../features/userSession/request";

type CreateContextOptions = {
  managementSession: ManagementSession | null;
  req: NextApiRequest;
  res?: NextApiResponse;
};

export const createStaticContext = () => {
  return {
    requestId: cuid(), // Unique request ID
    prisma, // Pass Prisma instance for database access
    mail,
  };
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  const managementUser = opts.managementSession?.user?.id
    ? await prisma.managementUser.findUnique({
        where: {
          id: opts.managementSession.user.id,
        },
      })
    : undefined;

  return {
    ...createStaticContext(), // All static context
    managementSession: opts.managementSession,
    host: opts.req.headers.host, // Pass host from headers
    managementUser,
    userSession: opts.res
      ? createUserSessionContext(opts.req, opts.res)
      : undefined,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: Pick<CreateNextContextOptions, "req" | "res">,
) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const managementSession = await getServerManagementSession({
    headers: fromNodeHeaders(req.headers),
  });

  return await createContextInner({ managementSession, req, res });
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export type StaticContext = Awaited<ReturnType<typeof createStaticContext>>;
