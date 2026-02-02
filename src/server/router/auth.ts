import { router } from "../trpc/trpc";
import { emailVerificationRouter } from "./auth.emailVerification";
import { hashPassword } from "@/server/features/password/password";
import { userSignUpSchema } from "@/features/auth/utils/userSignUpSchema";
import { TRPCError } from "@trpc/server";
import { sendNewEmailVerificationToken } from "@/features/emailVerification/sendNewEmailVerificationToken";
import { passwordChangeRouter } from "./auth.passwordChange";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { auth } from "@/server/auth";

export const authRouter = router({
  emailVerification: emailVerificationRouter,
  passwordChange: passwordChangeRouter,
});

// Utilities

/*function capitalize(str: string) {
  return str.at(0)?.toUpperCase() + str.slice(1);
}*/
