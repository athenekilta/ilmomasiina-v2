import { z } from "zod";

export type UserSignUpValidationMessages = {
  invalidEmail: string;
  nameTooShort: (minimum: number) => string;
  passwordTooShort: (minimum: number) => string;
};

const defaultValidationMessages: UserSignUpValidationMessages = {
  invalidEmail: "Anna kelvollinen sähköpostiosoite",
  nameTooShort: (minimum) => `Nimen on oltava vähintään ${minimum} merkkiä`,
  passwordTooShort: (minimum) =>
    `Salasanan on oltava vähintään ${minimum} merkkiä`,
};

export function createUserSignUpSchema(messages: UserSignUpValidationMessages) {
  return z.object({
    name: z.string().min(3, messages.nameTooShort(3)),
    email: z
      .string()
      .email(messages.invalidEmail)
      .transform((email) => email.toLowerCase()),
    password: z.string().min(8, messages.passwordTooShort(8)),
  });
}

export const userSignUpSchema = createUserSignUpSchema(
  defaultValidationMessages,
);

export type UserSignUpFormValues = z.input<typeof userSignUpSchema>;
