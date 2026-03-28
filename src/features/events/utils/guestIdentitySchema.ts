import { z } from "zod";

/** Same rules as event ilmo form: used by Registration and header guest panel. */
export const guestIdentitySchema = z.object({
  email: z.string().email("Anna kelvollinen sähköpostiosoite"),
  name: z.string().min(3, "Nimen on oltava vähintään 3 merkkiä"),
});

export type GuestIdentityFormValues = z.infer<typeof guestIdentitySchema>;
