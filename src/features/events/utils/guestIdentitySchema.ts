import { z } from "zod";

export type GuestIdentityValidationMessages = {
  invalidEmail: string;
  nameTooShort: string;
};

const defaultMessages: GuestIdentityValidationMessages = {
  invalidEmail: "Anna kelvollinen sähköpostiosoite",
  nameTooShort: "Nimen on oltava vähintään 3 merkkiä",
};

/** Same rules as the event registration form and header guest panel. */
export const createGuestIdentitySchema = (
  messages: GuestIdentityValidationMessages = defaultMessages,
) =>
  z.object({
    email: z.string().email(messages.invalidEmail),
    name: z.string().min(3, messages.nameTooShort),
  });

export const guestIdentitySchema = createGuestIdentitySchema();
export type GuestIdentityFormValues = z.infer<typeof guestIdentitySchema>;
