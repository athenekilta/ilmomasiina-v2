import { router } from "../trpc/trpc";
import { emailVerificationRouter } from "./auth.emailVerification";
import { hashPassword } from "@/server/features/password/password";
import { userSignUpSchema } from "@/features/auth/utils/userSignUpSchema";
import { TRPCError } from "@trpc/server";
import { sendNewEmailVerificationToken } from "@/features/emailVerification/sendNewEmailVerificationToken";
import { passwordChangeRouter } from "./auth.passwordChange";
import { publicProcedure } from "../trpc/procedures/publicProcedure";

export const authRouter = router({
  emailVerification: emailVerificationRouter,
  passwordChange: passwordChangeRouter,

  singUp: publicProcedure
    .input(userSignUpSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
      // hash password
      const hashedPassword = await hashPassword(input.password);

      // create user
      await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: getNameFromEmail(input.email),
        },
      });
      await sendNewEmailVerificationToken(
        ctx,
        { email: input.email },
        { force: true }
      );
    }),
});

// Utilities

function capitalize(str: string) {
  return str.at(0)?.toUpperCase() + str.slice(1);
}

function getNameFromEmail(email: string) {
  // Get `emailName` (part before split chars)
  // "test.user+postfix@gmail.com" => "test.user"
  const splitAtChars = ["+", "@"];
  const emailName = email.substring(
    0,
    Math.min(
      ...splitAtChars
        .map((char) => email.indexOf(char))
        .filter((index) => index > 0)
    )
  );
  // Remove all numbers
  const emailNameWithoutNumbers = emailName.replace(/\d/g, "");

  // Capitalize each word and join with spaces
  return emailNameWithoutNumbers
    .split(".")
    .filter(Boolean)
    .map((str) => capitalize(str))
    .join(" ");
}
