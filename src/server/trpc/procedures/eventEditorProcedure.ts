import { TRPCError } from "@trpc/server";
import { ManagementRole } from "@/generated/prisma/client";
import { protectedProcedure } from "./protectedProcedure";

export const eventEditorProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (
      ctx.managementUser.role !== ManagementRole.event_editor &&
      ctx.managementUser.role !== ManagementRole.superadmin
    ) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next();
  },
);
