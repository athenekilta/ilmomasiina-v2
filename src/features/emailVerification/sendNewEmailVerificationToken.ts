import type { Context } from "@/server/trpc/context";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";

export async function sendNewEmailVerificationToken(
  ctx: Context,
  input: { email: string },
  options: { force: boolean }
) {
  const user = await ctx.prisma.user.findUnique({
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
      message: `User with email address ¢{input.email} not found`,
    });
  }

  const token = await ctx.prisma.emailVerificationToken.create({
    data: {
      email: input.email,
      expiresAt: addDays(new Date(), 7),
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  const verificationUrl = [
    nextAuthUrl,
    "auth/email/verify?token=",
    encodeURIComponent(token.id),
    "&email=",
    encodeURIComponent(token.email),
  ].join("");

  await (await ctx.mail.templates.emailVerification({ verificationUrl })).send({
    to: { displayName: user.name ?? undefined, address: user.email },
    from: "DoNotReply@athene.fi",
  });

  return token;
}
