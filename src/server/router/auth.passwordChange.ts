import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isPast, addDays } from "date-fns";
import { router } from "../trpc/trpc";
import { userSignUpSchema } from "@/features/auth/utils/userSignUpSchema";
import { hashPassword } from "../features/password/password";
import { publicProcedure } from "../trpc/procedures/publicProcedure";

export const passwordChangeRouter = router({
  change: publicProcedure
    .input(
      z.object({
        password: z.string().min(8),
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = await ctx.prisma.passwordChangeToken.findFirst({
        where: {
          id: input.token,
        },
      });

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token not found",
        });
      }

      if (isPast(token.expiresAt)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token expired",
        });
      }

      const hashedPassword = await hashPassword(input.password);

      await ctx.prisma.user.update({
        where: {
          email: token.email,
        },
        data: {
          password: hashedPassword,
        },
      });

      await ctx.prisma.passwordChangeToken.deleteMany({
        where: {
          email: token.email,
        },
      });
    }),

  request: publicProcedure
    .input(
      z.object({
        email: userSignUpSchema.shape.email,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user || !user.email) {
        return null;
      }

      const token = await ctx.prisma.passwordChangeToken.create({
        data: {
          email: user.email,
          expiresAt: addDays(new Date(), 7),
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

      const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

      const passwordChangeUrl = [
        nextAuthUrl,
        "auth/password/change?token=",
        encodeURIComponent(token.id),
        "&email=",
        encodeURIComponent(token.email),
      ].join("/");

      await (await ctx.mail.templates.passwordChange({ passwordChangeUrl })).send({
        to: { displayName: user.name ?? undefined, address: user.email },
        from: "DoNotReply@athene.fi",
      });
    }),
  validate: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const token = await ctx.prisma.passwordChangeToken.findFirst({
        where: {
          id: input.token,
        },
      });
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token",
        });
      }

      if (isPast(token.expiresAt)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token expired",
        });
      }

      return token.email;
    }),
});
