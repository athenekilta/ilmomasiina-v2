import type { HTMLAttributes } from "react";
import { c } from "@/utils/classnames";

type DividerOrientation = "horizontal" | "vertical";
type DividerThickness = "thin" | "medium";
type DividerTone = "subtle" | "default" | "strong";
type DividerSpacingY = "none" | "sm" | "md" | "lg";

export type DividerProps = {
  orientation?: DividerOrientation;
  thickness?: DividerThickness;
  tone?: DividerTone;
  spacingY?: DividerSpacingY;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

const orientationClassNames: Record<DividerOrientation, string> = {
  horizontal: "w-full border-0 border-t",
  vertical: "h-full border-0 border-l",
};

const thicknessClassNames: Record<DividerThickness, string> = {
  thin: "border-[1px]",
  medium: "border-[2px]",
};

const toneClassNames: Record<DividerTone, string> = {
  subtle: "border-gray-200",
  default: "border-gray-300",
  strong: "border-gray-500",
};

const spacingYClassNames: Record<DividerSpacingY, string> = {
  none: "my-0",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

export function Divider({
  orientation = "horizontal",
  thickness = "thin",
  tone = "default",
  spacingY = "md",
  className,
  ...htmlProps
}: DividerProps) {
  const dividerClassName = c(
    orientationClassNames[orientation],
    thicknessClassNames[thickness],
    toneClassNames[tone],
    orientation === "horizontal" && spacingYClassNames[spacingY],
    className,
  );

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={dividerClassName}
        {...htmlProps}
      />
    );
  }

  return <hr className={dividerClassName} />;
}
