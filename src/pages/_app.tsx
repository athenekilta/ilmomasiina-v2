import "../styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Alerts } from "@/features/alert/components/Alerts";
import { UserInitializer } from "@/features/auth/components/UserInitializer";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Initialize worker in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      void fetch('/api/cron/init');
    }
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <Alerts>
          <UserInitializer />
          <Component {...pageProps} />
        </Alerts>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
