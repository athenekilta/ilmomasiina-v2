import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "../server/router/_app";
import { env } from "@/env/client.mjs";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  // Dev SSR should use localhost
  const devHost = process.env.DEV_HOST || "localhost";
  const devPort = process.env.PORT || 3000;
  return `http://${devHost}:${devPort}`;
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) => {
            const isErrorResponse =
              opts.direction === "down" && opts.result instanceof Error;
            // Respect NEXT_PUBLIC_DEV_TRPC_LOG
            switch (env.NEXT_PUBLIC_DEV_TRPC_LOG) {
              case "true":
                return true;
              case "false":
                return false;
              case "down":
                return opts.direction === "down";
              case "up":
                return opts.direction === "up";
              case "error":
                return isErrorResponse;
            }
          },
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
  /**
   * In order to not have to worry about invalidating queries initially,
   * we invalidate all queries on every mutation. This should solve some
   * unnecessary query invalidation related bugs in development and speed
   * up development.
   *
   * Later on, mutations can be optimized to invalidate correct (enough)
   * queries.
   *
   * Since we have request batching, this invalidation will simply refetch all
   * queries on the page you're looking at in one single request.
   *
   * https://trpc.io/docs/useContext#invalidating-across-whole-routers
   */
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
