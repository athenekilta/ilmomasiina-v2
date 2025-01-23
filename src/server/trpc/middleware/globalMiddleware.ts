import { env } from "../../../env/server.mjs";
import { trpcMiddleware } from "../trpc";

export const globalMiddleware = trpcMiddleware(async ({ next }) => {
  if (env.NODE_ENV === "development") {
    await new Promise((resolve) =>
      setTimeout(resolve, env.DEV_REQUEST_DELAY_MS)
    );
  }
  return next();
});
