import { useRouter } from "next/router";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { localePath, stripLocalePrefix, type Locale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/**
 * The other language, as a link rather than a control.
 *
 * A bordered select was the only boxed thing in the header band, and next to
 * flat text on flat green it read as a widget someone had dropped in. There
 * are two languages, so a picker was never buying anything a link does not:
 * this says where it goes and goes there.
 */
export function LanguageSelector() {
  const router = useRouter();
  const locale = useLocale();
  const messages = useTranslations(commonMessages);
  const nextLocale: Locale = locale === "fi" ? "en" : "fi";

  const changeLocale = () => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    window.location.assign(
      localePath(nextLocale, stripLocalePrefix(router.asPath)),
    );
  };

  return (
    <button
      type="button"
      onClick={changeLocale}
      lang={nextLocale}
      aria-label={messages.language}
      className="label-caps cursor-pointer text-white/90 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
    >
      {messages.switchLanguage}
    </button>
  );
}
