import { Button } from "@/components/Button";

export function ConfirmationDialog({
  message,
  onConfirmAction,
  onCancelAction,
  pending,
}: {
  message: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  pending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="surface-panel shadow-card w-full max-w-md p-6">
        <h3 className="text-brand-dark mb-3 text-lg font-bold tracking-tight">
          Confirm Deletion
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">{message}</p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            color="secondary"
            className="w-full sm:w-auto"
            onClick={onCancelAction}
          >
            Cancel
          </Button>

          <Button
            color="danger"
            className="w-full sm:w-auto"
            onClick={onConfirmAction}
            aria-disabled={pending}
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
