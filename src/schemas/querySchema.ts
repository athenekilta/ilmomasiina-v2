import { z } from "zod";

/**
 * Utility types to handle .optional().catch(undefined) for most common types.
 */
const util = {
  str: () => z.string().optional().catch(undefined),
  bool: () =>
    z
      .string()
      .optional()
      .transform((val) => !!val)
      .pipe(z.boolean())
      .optional()
      .catch(undefined),
  number: () => z.coerce.number().optional().catch(undefined),
  enum: <U extends string, T extends Readonly<[U, ...U[]]>>(t: T) =>
    z.enum(t).optional().catch(undefined),
};

/**
 * Define all variables that can be included in the query. This includes both:
 *
 * - Search params (?example=1)
 * - Path params   (/[example]/)
 */
export const querySchema = z.object({
  // =================================================================================================================
  // In search
  // =================================================================================================================

  // The search can optionally include a message and a message type to be shown on the client. Mostly used in
  // auth routes.
  message: util.str(),
  messageType: util.enum(["default", "error", "warning"]),

  // The search can include a token and an email. Mostly used in auth routes.
  token: util.str(),
  email: util.str(),

  // The search can include an error to be displayed on the client. Mostly used in auth routes.
  error: util.str(),

  // Checkout return signals
  // checkoutCanceled: util.bool(),
  // checkoutSuccess: util.bool(),
  // paymentPrompt: util.bool(),

  // =================================================================================================================
  // In path
  // =================================================================================================================

  eventId: util.number(),
  signupId: util.str(),
});

export type QuerySchema = z.TypeOf<typeof querySchema>;
