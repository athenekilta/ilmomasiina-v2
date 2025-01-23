import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "./protectedProcedure";

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = ctx.user;

  if (user.role !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next();
});
