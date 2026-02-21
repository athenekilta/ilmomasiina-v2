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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-brand-light w-full max-w-md rounded-lg p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Confirm Deletion</h3>

        <p className="mb-6 text-gray-600">{message}</p>

        <div className="flex justify-end space-x-4">
          <Button color="secondary" onClick={onCancelAction}>
            Cancel
          </Button>

          <Button
            color="danger"
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
