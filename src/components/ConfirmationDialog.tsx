import { Button } from "@/components/Button";
import { useId, useRef } from "react";
import { useTranslations } from "@/i18n/I18nProvider";
import { commonMessages } from "@/i18n/messages/common";

export function ConfirmationDialog({
  title,
  message,
  onConfirmAction,
  onCancelAction,
  pending,
  confirmLabel,
  cancelLabel,
}: {
  title?: string;
  message?: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  pending: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const messages = useTranslations(commonMessages);
  const dialogTitle = title ?? messages.confirmDelete;
  const dialogConfirmLabel = confirmLabel ?? messages.delete;
  const dialogCancelLabel = cancelLabel ?? messages.cancel;
  const id = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={message ? `${id}-message` : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !pending) {
          event.preventDefault();
          event.stopPropagation();
          onCancelAction();
        }
        if (event.key === "Tab") {
          event.preventDefault();
          if (pending) return;
          const nextButton =
            document.activeElement === cancelRef.current
              ? confirmRef.current
              : cancelRef.current;
          nextButton?.focus();
        }
      }}
    >
      <div className="surface-panel shadow-card w-full max-w-md p-6 sm:p-7">
        <h3
          id={`${id}-title`}
          className="text-brand-dark mb-3 text-lg font-bold tracking-tight"
        >
          {dialogTitle}
        </h3>

        {message && (
          <p
            id={`${id}-message`}
            className="mb-6 text-sm leading-relaxed text-gray-600"
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            ref={cancelRef}
            type="button"
            autoFocus
            variant="bordered"
            color="neutral"
            className="w-full sm:min-w-28 sm:flex-initial"
            onClick={onCancelAction}
            disabled={pending}
          >
            {dialogCancelLabel}
          </Button>

          <Button
            ref={confirmRef}
            type="button"
            color="danger"
            className="w-full sm:min-w-28 sm:flex-initial"
            onClick={onConfirmAction}
            loading={pending}
          >
            {dialogConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
