import { managementAuth } from "@/server/auth";

export const getServerManagementSession = async (ctx: { headers: Headers }) => {
  return await managementAuth.api.getSession({ headers: ctx.headers });
};
