import { Button } from "@/components/Button";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

export function DraftChangeNotice({
  onReload,
  disabled = false,
}: {
  onReload: () => void;
  disabled?: boolean;
}) {
  const messages = useTranslations(eventAdminMessages);

  return (
    <div
      role="status"
      className="surface-muted mb-4 space-y-3 border border-amber-300 p-4 text-sm"
    >
      <p>{messages.draft.notice}</p>
      <Button
        type="button"
        variant="bordered"
        disabled={disabled}
        onClick={onReload}
      >
        {messages.draft.reload}
      </Button>
    </div>
  );
}
