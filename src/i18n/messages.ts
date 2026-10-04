import type { Locale } from "./config";

type MessageObject = Record<string, unknown>;

type TranslationShape<T> = {
  readonly [Key in keyof T]: T[Key] extends (...args: infer Args) => unknown
    ? (...args: Args) => string
    : T[Key] extends MessageObject
      ? TranslationShape<T[Key]>
      : string;
};

export type Messages<T extends MessageObject> = Readonly<
  Record<Locale, TranslationShape<T>>
>;

export function defineMessages<const T extends MessageObject>(messages: {
  readonly fi: T;
  readonly en: TranslationShape<T>;
}): Messages<T> {
  return messages as Messages<T>;
}

export function getTranslations<T extends MessageObject>(
  messages: Messages<T>,
  locale: Locale,
): TranslationShape<T> {
  return messages[locale];
}
