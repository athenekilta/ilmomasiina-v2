import { z } from "zod";

export type SignupFormValidationMessages = {
  nameRequired: string;
  invalidEmail: string;
};

const defaultMessages: SignupFormValidationMessages = {
  nameRequired: "Nimi on pakollinen",
  invalidEmail: "Anna kelvollinen sähköpostiosoite",
};

export const createSignupFormSchema = (
  messages: SignupFormValidationMessages = defaultMessages,
) =>
  z.object({
    name: z.string().min(1, messages.nameRequired),
    email: z.string().email(messages.invalidEmail),
    answers: z.array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
      }),
    ),
  });

export const signupFormSchema = createSignupFormSchema();
export type SignupFormValues = z.infer<typeof signupFormSchema>;
