import {
  fallbackLocale,
  locales,
  parseLocale,
  type Locale,
} from "@/i18n/config";

type Translation = { locale: string };

export function communicationLocale(value: string): Locale {
  return parseLocale(value);
}

export function localizedTranslation<T extends Translation>(
  translations: readonly T[],
  locale: Locale,
): T | undefined {
  return (
    translations.find((translation) => translation.locale === locale) ??
    translations.find((translation) => translation.locale === fallbackLocale) ??
    translations[0]
  );
}

export function localizedValue<T extends Translation>(
  translations: readonly T[],
  locale: Locale,
  select: (translation: T) => string | null | undefined,
): string {
  const translation = localizedTranslation(translations, locale);
  return translation ? (select(translation) ?? "") : "";
}

export function translationRecord<T extends Translation>(
  translations: readonly T[],
  select: (translation: T) => string | null | undefined,
): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => {
      const translation = translations.find((row) => row.locale === locale);
      return [locale, translation ? (select(translation) ?? "") : ""];
    }),
  ) as Record<Locale, string>;
}
