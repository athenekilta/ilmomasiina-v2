import { z } from "zod";
import { router } from "../trpc/trpc";
import { adminProcedure } from "../trpc/procedures/adminProcedure";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@/generated/prisma/client";

export const usersRouter = router({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
      },
    });

    return users;
  }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(UserRole),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (
        input.userId === ctx.session.user.id &&
        input.role !== UserRole.admin
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't demote yourself from admin role",
        });
      }

      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),
});
