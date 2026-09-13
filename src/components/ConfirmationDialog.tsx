import { Button } from "@/components/Button";
import { useId, useRef } from "react";

export function ConfirmationDialog({
  title = "Vahvista poisto",
  message,
  onConfirmAction,
  onCancelAction,
  pending,
  confirmLabel = "Poista",
  cancelLabel = "Peruuta",
}: {
  title?: string;
  message?: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  pending: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
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
          {title}
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
            {cancelLabel}
          </Button>

          <Button
            ref={confirmRef}
            type="button"
            color="danger"
            className="w-full sm:min-w-28 sm:flex-initial"
            onClick={onConfirmAction}
            loading={pending}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
