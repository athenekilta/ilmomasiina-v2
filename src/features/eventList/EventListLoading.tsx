import { Loader2 } from "lucide-react";
import { useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";

export function EventListLoading({ compact = false }: { compact?: boolean }) {
  const messages = useTranslations(publicEventsMessages);

  return (
    <div
      className={`flex justify-center ${compact ? "py-6" : "py-12"}`}
      role="status"
    >
      <Loader2
        size={28}
        strokeWidth={2.25}
        className="text-brand-primary animate-spin"
        aria-label={messages.detail.loading}
      />
    </div>
  );
}
