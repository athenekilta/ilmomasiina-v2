import { TRPCError } from "@trpc/server";
import type { Context } from "../context";
import { trpcMiddleware } from "../trpc";

/**
 * Reusable middleware to ensure users are logged in and pass all checks.
 */
export const isAuthedMiddleware = (
  validate: (ctx: Context) => boolean | Promise<boolean>
) =>
  trpcMiddleware(async ({ ctx, next }) => {
    // Ensure authentication
    if (
      !ctx.managementSession ||
      !ctx.managementSession.user ||
      !ctx.managementUser
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Run extra validation function
    const validationPassed = await validate(ctx);
    if (!validationPassed) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        // Infers management authentication as non-nullable downstream.
        managementUser: ctx.managementUser,
        managementSession: {
          ...ctx.managementSession,
          user: ctx.managementSession.user,
        },
      },
    });
  });
