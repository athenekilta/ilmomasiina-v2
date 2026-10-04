import { Languages } from "lucide-react";
import { useRouter } from "next/router";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { type Locale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export function LanguageSelector() {
  const router = useRouter();
  const locale = useLocale();
  const messages = useTranslations(commonMessages);

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    void router.push(router.asPath, router.asPath, { locale: nextLocale });
  };

  return (
    <label className="flex items-center gap-1.5 text-sm text-white">
      <Languages size={18} aria-hidden />
      <span className="sr-only">{messages.language}</span>
      <select
        value={locale}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        aria-label={messages.language}
        className="cursor-pointer rounded-sm border border-white/40 bg-transparent px-1.5 py-1 text-sm text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
      >
        <option value="fi" className="text-black">
          {messages.finnish}
        </option>
        <option value="en" className="text-black">
          {messages.english}
        </option>
      </select>
    </label>
  );
}
