import "md-editor-rt/lib/style.css";
import "../styles/globals.css";

import { type AppType } from "next/app";
import { useRouter } from "next/router";

import { Alerts } from "@/features/alert/components/Alerts";
import { UserInitializer } from "@/features/auth/components/UserInitializer";
import { Realtime } from "@/features/realtime/Realtime";
import { I18nProvider } from "@/i18n/I18nProvider";
import { parseLocale } from "@/i18n/config";
import { api } from "../utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <I18nProvider locale={parseLocale(router.locale)}>
      <Alerts>
        <UserInitializer />
        <Realtime />
        <Component {...pageProps} />
      </Alerts>
    </I18nProvider>
  );
};

export default api.withTRPC(MyApp);
