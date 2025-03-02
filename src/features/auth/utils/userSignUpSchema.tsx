import { z } from "zod";

export const userSignUpSchema = z.object({
  name: z.string().min(3),
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});
