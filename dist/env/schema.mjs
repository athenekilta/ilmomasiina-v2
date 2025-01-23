"use strict";
// @ts-check
import { z } from "zod";
/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    DEV_REQUEST_DELAY_MS: z.coerce
        .number()
        .int("Request delay must be an integer in milliseconds")
        .min(0, "Request delay must be non-negative")
        .max(9999, "Request delay must be under 10 000 ms (10 seconds)")
        .default(0)
        .catch(0),
    NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => { var _a; return (_a = process.env.VERCEL_URL) !== null && _a !== void 0 ? _a : str; }, 
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()),
    MAIL_API_KEY: z.string().default(""),
    PUSHER_APP_ID: z.string(),
    PUSHER_KEY: z.string(),
    PUSHER_SECRET: z.string(),
    PUSHER_CLUSTER: z.string(),
});
/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    NEXT_PUBLIC_DEV_TRPC_LOG: z
        .enum(["false", "true", "up", "down", "error"])
        .optional()
        .default("error")
        .catch("error"),
    NEXT_PUBLIC_PUSHER_KEY: z.string(),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
});
/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    NEXT_PUBLIC_DEV_TRPC_LOG: process.env.NEXT_PUBLIC_DEV_TRPC_LOG,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
};
