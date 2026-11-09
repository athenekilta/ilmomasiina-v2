import type { BetterAuthOptions } from "better-auth";

export function passwordChangeHooks(
  invalidateTokens: (userId: string) => Promise<void>,
): NonNullable<BetterAuthOptions["databaseHooks"]> {
  return {
    account: {
      update: {
        before: async (account, ctx) => {
          if (ctx?.path !== "/change-password" || !account.password) return;

          const userId = ctx.context.session?.user.id;
          if (!userId) throw new Error("Password change requires a session");

          // Better Auth has verified the current password at this point. Fail
          // closed before writing the new hash if token invalidation fails.
          // A later write failure may invalidate links, but cannot leave old
          // links usable after a successful password change.
          await invalidateTokens(userId);
        },
      },
    },
  };
}
