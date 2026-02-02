import { auth } from "@/server/auth";

export const getServerAuthSession = async (ctx: { headers: Headers }) => {
  return await auth.api.getSession({ headers: ctx.headers });
};
