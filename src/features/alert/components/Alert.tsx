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
      className="w-full rounded-lg bg-white shadow-lg"
    >
      <div className="relative flex items-center justify-between gap-4 text-lg">
        <div
          className={c(
            "h-fill rounded-lg p-3",
            c.variant(props.variant ?? "default")({
              primary: "bg-green",
              secondary: "bg-lime",
              error: "bg-red-400",
              default: "bg-gray-400",
              warning: "bg-yellow-400",
            }),
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
