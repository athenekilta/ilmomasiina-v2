import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isPast } from "date-fns";
import { router } from "../trpc/trpc";
import { userSignUpSchema } from "@/features/auth/utils/userSignUpSchema";
import { sendNewEmailVerificationToken } from "@/features/emailVerification/sendNewEmailVerificationToken";
import { publicProcedure } from "../trpc/procedures/publicProcedure";

export const emailVerificationRouter = router({
  verify: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: userSignUpSchema.shape.email,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = await ctx.prisma.emailVerificationToken.findFirst({
        where: {
          id: input.token,
          email: input.email,
        },
      });

      //   Token not found
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token not found",
        });
      }

      //   Token expired

      if (isPast(token.expiresAt)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token expired",
        });
      }

      await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          emailVerified: new Date(),
        },
      });
      await ctx.prisma.emailVerificationToken.deleteMany({
        where: { email: token.email },
      });
    }),
  request: publicProcedure
    .input(
      z.object({
        email: userSignUpSchema.shape.email,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await sendNewEmailVerificationToken(ctx, input, { force: true });
    }),
});
