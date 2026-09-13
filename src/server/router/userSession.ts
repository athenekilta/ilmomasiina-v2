import { z } from "zod";
import { guestIdentitySchema } from "@/features/events/utils/guestIdentitySchema";
import {
  getUserSession,
  rotateUserSession,
  setUserSessionIdentity,
} from "@/server/features/userSession/service";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { router } from "../trpc/trpc";

export const userSessionRouter = router({
  getIdentity: publicProcedure.query(async ({ ctx }) => {
    const session = await getUserSession(ctx.prisma, ctx.userSession);
    if (!session?.name || !session.email) return null;
    return { name: session.name, email: session.email };
  }),

  updateIdentity: publicProcedure
    .input(guestIdentitySchema)
    .mutation(async ({ ctx, input }) => {
      const session = await setUserSessionIdentity(ctx.userSession, input);
      return { name: session.name!, email: session.email! };
    }),

  clearIdentity: publicProcedure
    .input(z.void())
    .mutation(async ({ ctx }) => {
      await rotateUserSession(ctx.userSession, null);
    }),
});
