import { z } from "zod";

export const allowedEmailproviders = z.enum(["aalto.fi"]);

export const userSignUpSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase())
    .refine(
      (email) => {
        return allowedEmailproviders.parse(email.split("@")[1]);
      },
      { message: "Only Aalto email addresses are allowed" }
    ),
  password: z.string().min(8),
});
