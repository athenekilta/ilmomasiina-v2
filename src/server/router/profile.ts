import { userFormSchema } from "@/features/auth/utils/userFormSchema";
import { router } from "@/server/trpc/trpc";
import { z } from "zod";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { protectedProcedure } from "../trpc/procedures/protectedProcedure";

export const profileRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.managementSession?.user?.id) return null;

    return ctx.prisma.managementUser.findUnique({
      where: { id: ctx.managementSession.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: userFormSchema.shape.name.optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.managementUser.update({
        where: {
          id: ctx.managementUser?.id,
        },
        data: {
          name: input.name,
          image: input.image,
        },
      });
    }),
});
