import { z } from "zod";
import { router } from "../trpc/trpc";
import { superadminProcedure } from "../trpc/procedures/superadminProcedure";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@/generated/prisma/client";

export const usersRouter = router({
  getUsers: superadminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
  ),

  updateUserRole: superadminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(UserRole),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (
        input.userId === ctx.session.user.id &&
        input.role !== UserRole.superadmin
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot demote yourself from superadmin role",
        });
      }

      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),
});
