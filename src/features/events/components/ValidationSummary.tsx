import type { FieldErrors } from "react-hook-form";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

type ValidationSummaryProps = {
  errors: FieldErrors;
};

type CollectedError = {
  path: string;
  message: string;
};

function collectErrors(
  value: unknown,
  path: string[] = [],
): CollectedError[] {
  if (!value || typeof value !== "object") return [];

  if (
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  ) {
    return [
      {
        path: path.join("."),
        message: (value as { message: string }).message,
      },
    ];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    collectErrors(nestedValue, [...path, key]),
  );
}

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  const messages = useTranslations(eventAdminMessages);
  const fieldLabels = messages.validation.fields as Record<string, string>;

  const formatErrorPath = (path: string) => {
    const parts = path.split(".").filter(Boolean);
    const labels: string[] = [];

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const nextPart = parts[index + 1];

      if (!part) continue;
      if (part === "root" || part === "translations") continue;
      if (part === "quotas") {
        if (nextPart && /^\d+$/.test(nextPart)) {
          labels.push(messages.validation.quota(Number(nextPart) + 1));
          index += 1;
        } else {
          labels.push(messages.quotas.title);
        }
        continue;
      }
      if (part === "questions") {
        if (nextPart && /^\d+$/.test(nextPart)) {
          labels.push(messages.validation.question(Number(nextPart) + 1));
          index += 1;
        } else {
          labels.push(messages.questions.title);
        }
        continue;
      }
      if (part === "options") {
        if (nextPart && /^\d+$/.test(nextPart)) {
          labels.push(messages.validation.option(Number(nextPart) + 1));
          index += 1;
        } else {
          labels.push(fieldLabels.options ?? part);
        }
        continue;
      }
      if (/^\d+$/.test(part)) continue;

      labels.push(fieldLabels[part] ?? part);
    }

    return labels.join(" · ");
  };

  const allErrors = collectErrors(errors)
    .map((error) => ({
      path: formatErrorPath(error.path),
      message: messages.validation.message(error.message),
    }))
    .filter((error) => error.path);

  if (allErrors.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-card shadow-card fixed right-4 bottom-4 z-50 w-[min(100vw-2rem,24rem)] border border-rose-400 bg-rose-50 p-3"
    >
      <div className="flex">
        <svg
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-rose-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="ml-3 min-w-0 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {messages.validation.heading}
          </h3>
          <div className="mt-2 max-h-60 overflow-y-auto text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {allErrors.map((error, index) => (
                <li key={`${error.path}-${index}`} className="wrap-break-word">
                  <span className="font-medium">{error.path}:</span>{" "}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
