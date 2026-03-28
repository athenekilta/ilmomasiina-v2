import { Button } from "@/components/Button";

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
  message: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  pending: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="surface-panel shadow-card w-full max-w-md p-6 sm:p-7">
        <h3 className="text-brand-dark mb-3 text-lg font-bold tracking-tight">
          {title}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">{message}</p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="bordered"
            color="neutral"
            className="w-full sm:min-w-28 sm:flex-initial"
            onClick={onCancelAction}
            disabled={pending}
          >
            {cancelLabel}
          </Button>

          <Button
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
