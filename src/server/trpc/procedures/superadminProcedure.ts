import { TRPCError } from "@trpc/server";
import { UserRole } from "@/generated/prisma/client";
import { protectedProcedure } from "./protectedProcedure";

export const superadminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (ctx.user.role !== UserRole.superadmin) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next();
  },
);
