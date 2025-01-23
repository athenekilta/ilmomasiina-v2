import type { BaseVariant } from "@/types/types";
import { c } from "@/utils/classnames";

export interface AlertProps {
  title: string;
  description?: string;
  variant: BaseVariant;
  timeoutMs: number;
  createdAt: Date;
}

export function Alert({ ...props }: AlertProps) {
  return (
    <div
      data-var={props.variant}
      className="w-full rounded-lg border bg-white pr-9 shadow-lg"
    >
      <div className="feldx relative items-center justify-between gap-4">
        <div
          className={c(
            "h-fill rounded-l-lg p-3",
            c.variant(props.variant ?? "default")({
              primary: "bg-green",
              secondary: "bg-lime",
              error: "bg-red-500",
              default: "bg-gray-500",
              warning: "bg-yellow-500",
            })
          )}
        >
          <div className="flex flex-col items-stretch">
            <p className="pr-1 text-sm font-medium">{props.title}</p>
            <p className="text-sm text-black">{props.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
