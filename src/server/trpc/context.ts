import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../external/prisma";
import cuid from "cuid";
import type { NextApiRequest } from "next";
import { mail } from "../external/mail";

type CreateContextOptions = {
  session: Session | null;
  req: NextApiRequest;
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
  const user = opts.session?.user?.id
    ? await prisma.user.findUnique({
      where: {
        id: opts.session.user.id,
      },
    })
    : undefined;

  return {
    ...createStaticContext(), // All static context
    session: opts.session, // Pass through the session from the outer function
    host: opts.req.headers.host, // Pass host from headers
    user, // Pass user from Prisma if any
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({ session, req });
};

export type Context = inferAsyncReturnType<typeof createContext>;

export type StaticContext = inferAsyncReturnType<typeof createStaticContext>;
