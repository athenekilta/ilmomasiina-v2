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
          name: input.name,
        },
      });
      await sendNewEmailVerificationToken(
        ctx,
        { email: input.email },
        { force: true },
      );
    }),
});

// Utilities

/*function capitalize(str: string) {
  return str.at(0)?.toUpperCase() + str.slice(1);
}*/
