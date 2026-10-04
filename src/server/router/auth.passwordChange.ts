import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isPast, addDays } from "date-fns";
import { router } from "../trpc/trpc";
import { userSignUpSchema } from "@/features/auth/utils/userSignUpSchema";
import { hashPassword } from "better-auth/crypto";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { localePath, localeSchema } from "@/i18n/config";

export const passwordChangeRouter = router({
  change: publicProcedure
    .input(
      z.object({
        password: z.string().min(8),
        token: z.string(),
      }),
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

      const credentialAccount = await ctx.prisma.managementAccount.findFirst({
        where: {
          providerId: "credential",
          user: { email: token.email },
        },
      });

      if (!credentialAccount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No password login found for this account",
        });
      }

      await ctx.prisma.managementAccount.update({
        where: { id: credentialAccount.id },
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
        locale: localeSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.managementUser.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user || !user.email) {
        return null;
      }

      const token = await ctx.prisma.$transaction(async (tx) => {
        await tx.managementUser.update({
          where: { id: user.id },
          data: { preferredLocale: input.locale },
        });
        return tx.passwordChangeToken.create({
          data: {
            email: user.email!,
            expiresAt: addDays(new Date(), 7),
          },
        });
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const passwordChangeUrl = new URL(
        localePath(input.locale, "/auth/password/change"),
        baseUrl,
      );
      passwordChangeUrl.searchParams.set("token", token.id);
      passwordChangeUrl.searchParams.set("email", token.email);

      await (
        await ctx.mail.templates.passwordChange({
          locale: input.locale,
          passwordChangeUrl: passwordChangeUrl.toString(),
        })
      ).send({
        to: { displayName: user.name ?? undefined, address: user.email },
        from: "DoNotReply@athene.fi",
      });
    }),
  validate: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
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
