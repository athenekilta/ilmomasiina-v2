import "md-editor-rt/lib/style.css";
import "../styles/globals.css";

import { type AppType } from "next/app";

import { Alerts } from "@/features/alert/components/Alerts";
import { UserInitializer } from "@/features/auth/components/UserInitializer";
import { Realtime } from "@/features/realtime/Realtime";
import { api } from "../utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <>
        <Alerts>
          <UserInitializer />
          <Realtime />
          <Component {...pageProps} />
        </Alerts>
    </>
  );
};

export default api.withTRPC(MyApp);
