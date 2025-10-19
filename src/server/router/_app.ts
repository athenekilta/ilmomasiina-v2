import { router } from "../trpc/trpc";
import { authRouter } from "./auth";
import { eventsRouter } from "./events";
import { signupsRouter } from "./signups";
import { profileRouter } from "./profile";
import { raffleRouter } from "./raffle";
import { usersRouter } from "./users";

export const appRouter = router({
  auth: authRouter,
  events: eventsRouter,
  signups: signupsRouter,
  profile: profileRouter,
  raffle: raffleRouter,
  users: usersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
