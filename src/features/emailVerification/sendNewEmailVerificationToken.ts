import type { Context } from "@/server/trpc/context";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";
import { localePath, parseLocale, type Locale } from "@/i18n/config";

export async function sendNewEmailVerificationToken(
  ctx: Context,
  input: { email: string; locale?: Locale },
  options: { force: boolean },
) {
  const user = await ctx.prisma.managementUser.findUnique({
    where: { email: input.email },
  });
  if (!options.force) {
    if (!user || user.emailVerified || !user.email) return;

    const token = await ctx.prisma.emailVerificationToken.findFirst({
      where: { email: input.email, expiresAt: { gt: new Date() } },
    });
    if (token) return;
  }

  if (!user || !user.email) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `User with email address ${input.email} not found`,
    });
  }

  const locale = input.locale ?? parseLocale(user.preferredLocale);
  const token = await ctx.prisma.$transaction(async (tx) => {
    if (input.locale && user.preferredLocale !== input.locale) {
      await tx.managementUser.update({
        where: { id: user.id },
        data: { preferredLocale: input.locale },
      });
    }
    return tx.emailVerificationToken.create({
      data: {
        email: input.email,
        expiresAt: addDays(new Date(), 7),
      },
    });
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verificationUrl = new URL(
    localePath(locale, "/auth/email/verify"),
    baseUrl,
  );
  verificationUrl.searchParams.set("token", token.id);
  verificationUrl.searchParams.set("email", token.email);

  await (
    await ctx.mail.templates.emailVerification({
      locale,
      verificationUrl: verificationUrl.toString(),
    })
  ).send({
    to: { displayName: user.name ?? undefined, address: user.email },
    from: "DoNotReply@athene.fi",
  });

  return token;
}
