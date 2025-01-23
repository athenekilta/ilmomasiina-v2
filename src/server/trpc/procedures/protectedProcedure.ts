import type { Context } from "../context";
import { trpcProcedure } from "../trpc";
import { isAuthedMiddleware } from "../middleware/isAuthedMiddleware";
import { globalMiddleware } from "../middleware/globalMiddleware";
import type { RequiredProp } from "@/types/types";

/**
 * Protected procedure
 */
export const protectedProcedure = trpcProcedure
  .use(globalMiddleware)
  .use(isAuthedMiddleware(() => true));

export type ProtectedProcedureContext = RequiredProp<
  Context,
  "user" | "session"
>;
