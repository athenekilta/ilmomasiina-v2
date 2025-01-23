import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const trpcMiddleware = t.middleware;
export const trpcProcedure = t.procedure;
export const router = t.router;
