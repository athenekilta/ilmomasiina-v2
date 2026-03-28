import type { BaseVariant } from "@/types/types";
import { c } from "@/utils/classnames";

export interface AlertProps {
  title: string;
  description?: string;
  variant: BaseVariant;
  timeoutMs: number;
  createdAt: Date;
}

const accentClass: Record<BaseVariant, string> = {
  primary: "bg-brand-primary",
  secondary: "bg-brand-lime",
  error: "bg-danger",
  default: "bg-gray-400",
  warning: "bg-warning",
};

export function Alert({ ...props }: AlertProps) {
  const variant = props.variant ?? "default";

  return (
    <div
      data-var={variant}
      className="surface-panel flex max-w-md overflow-hidden shadow-card"
    >
      <div
        className={c("w-1.5 shrink-0", accentClass[variant])}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-3 pl-4">
        <p className="text-sm font-semibold text-brand-dark">{props.title}</p>
        <p className="text-sm leading-snug text-gray-600">{props.description}</p>
      </div>
    </div>
  );
}
