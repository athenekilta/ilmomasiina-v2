import { z } from "zod";
import { router } from "../trpc/trpc";
import { superadminProcedure } from "../trpc/procedures/superadminProcedure";
import { TRPCError } from "@trpc/server";
import { ManagementRole } from "@/generated/prisma/client";

export const usersRouter = router({
  getUsers: superadminProcedure.query(({ ctx }) =>
    ctx.prisma.managementUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
  ),

  updateManagementRole: superadminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(ManagementRole),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (
        input.userId === ctx.managementSession.user.id &&
        input.role !== ManagementRole.superadmin
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot demote yourself from superadmin role",
        });
      }

      return ctx.prisma.managementUser.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),
});
