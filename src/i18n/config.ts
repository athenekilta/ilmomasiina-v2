import { z } from "zod";

export const locales = ["fi", "en"] as const;
export const localeSchema = z.enum(locales);
export type Locale = z.infer<typeof localeSchema>;

export const defaultLocale: Locale = "fi";
export const fallbackLocale: Locale = "fi";

export const intlLocale: Record<Locale, string> = {
  fi: "fi-FI",
  en: "en-GB",
};

export const dateFnsLocaleCode: Record<Locale, string> = {
  fi: "fi",
  en: "en-GB",
};

export const appTimeZone = "Europe/Helsinki";

export function parseLocale(value: unknown): Locale {
  return localeSchema.catch(defaultLocale).parse(value);
}

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
