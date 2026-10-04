import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { defaultLocale, intlLocale, type Locale } from "./config";
import { getTranslations, type Messages } from "./messages";

type I18nContextValue = {
  locale: Locale;
  intlLocale: string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  intlLocale: intlLocale[defaultLocale],
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ locale, intlLocale: intlLocale[locale] }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

export function useIntlLocale(): string {
  return useContext(I18nContext).intlLocale;
}

export function useTranslations<T extends Record<string, unknown>>(
  messages: Messages<T>,
) {
  return getTranslations(messages, useLocale());
}
