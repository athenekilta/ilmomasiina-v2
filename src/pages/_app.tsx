import "../styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "@/server/auth";
import { Alerts } from "@/features/alert/components/Alerts";
import { UserInitializer } from "@/features/auth/components/UserInitializer";
import { api } from "../utils/api";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Initialize worker in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void fetch("/api/cron/init");
    }
  }, []);

  return (
    <>
        <Alerts>
          <UserInitializer />
          <Component {...pageProps} />
        </Alerts>
    </>
  );
};

export default api.withTRPC(MyApp);
