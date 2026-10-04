import { router } from "../trpc/trpc";
import { emailVerificationRouter } from "./auth.emailVerification";
import { passwordChangeRouter } from "./auth.passwordChange";

export const authRouter = router({
  emailVerification: emailVerificationRouter,
  passwordChange: passwordChangeRouter,
});
