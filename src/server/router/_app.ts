import { router } from "../trpc/trpc";
import { authRouter } from "./auth";
import { eventsRouter } from "./events";
import { signupsRouter } from "./signups";
import { profileRouter } from "./profile";

import { usersRouter } from "./users";
import { userSessionRouter } from "./userSession";

export const appRouter = router({
  auth: authRouter,
  events: eventsRouter,
  signups: signupsRouter,
  profile: profileRouter,
  users: usersRouter,
  userSession: userSessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
