import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});
