import type { LinkProps } from "next/link";
import Link from "next/link";
import React, { forwardRef } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import type { ColorVariant } from "@/types/types";

export type IconButtonVariant = "filled" | "bordered" | "icon";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: IconButtonVariant;
  color?: ColorVariant;
  children?: React.ReactNode;
  startLabel?: string;
  endLabel?: string;
  inputAdornment?: "start" | "end";
};

export type IconButtonLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: IconButtonVariant;
    color?: ColorVariant;
    children?: React.ReactNode;
    startLabel?: string;
    endLabel?: string;
  };

export const IconButton = Object.assign(
  forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    {
      loading,
      variant,
      color,
      children,
      className,
      inputAdornment,
      startLabel,
      endLabel,
      ...htmlProps
    },
    ref,
  ) {
    return (
      <button
        {...htmlProps}
        ref={ref}
        disabled={loading || htmlProps.disabled}
        className={getClassName({
          variant,
          color,
          className,
          loading,
          disabled: htmlProps.disabled,
          inputAdornment,
        })}
      >
        {
          // Loading icon
          loading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingSpinner variant="puff" />
            </div>
          )
        }

        {startLabel && <p className="-mr-2 pl-1 text-sm">{startLabel}</p>}

        {children}

        {endLabel && <p className="-ml-2 pr-1 text-sm">{endLabel}</p>}
      </button>
    );
  }),
  {
    Link: function LinkButton({
      variant,
      color,
      className,
      children,
      startLabel,
      endLabel,
      ...htmlProps
    }: IconButtonLinkProps) {
      return (
        <Link
          {...htmlProps}
          className={getClassName({ variant, color, className })}
        >
          {startLabel && <p className="-mr-2 pl-1 text-sm">{startLabel}</p>}

          {children}

          {endLabel && <p className="-ml-2 pr-1 text-sm">{endLabel}</p>}
        </Link>
      );
    },
  },
);

/**
 * Large custom tailwind styles are extracted into this function.
 */
function getClassName(props: {
  loading?: boolean;
  disabled?: boolean;
  variant?: IconButtonVariant;
  color?: ColorVariant;
  className?: string;
  inputAdornment?: "start" | "end";
}) {
  const classNameList = [
    "relative flex flex-row gap-4 items-center justify-center p-2",
    variableButtonClassNames[props.variant ?? "icon"][0],
    variableButtonClassNames[props.variant ?? "icon"][1][
      props.color ?? "black"
    ],
  ];

  if (props.loading) classNameList.push("opacity-60");
  else if (props.disabled) classNameList.push("opacity-40");
  if (props.className) classNameList.push(props.className);

  if (!props.inputAdornment) classNameList.push("rounded-full");
  else if (props.inputAdornment === "start")
    classNameList.push("-ml-2 pl-3 rounded-lg");
  else if (props.inputAdornment === "end")
    classNameList.push("-mr-2 pr-3 rounded-lg");

  return classNameList.join(" ");
}

const variableButtonClassNames: Record<
  IconButtonVariant,
  [string, Record<ColorVariant, string>]
> = {
  filled: [
    "",
    {
      black:
        "bg-black text-white enabled:hover:bg-black/85 enabled:active:bg-black/75",
      white:
        "bg-white text-black enabled:hover:bg-black/85 enabled:active:bg-black/75",
      primary:
        "bg-brand-primary text-white enabled:hover:bg-brand-primary/85 enabled:active:bg-brand-primary/75",
      secondary:
        "bg-brand-lime text-black enabled:hover:bg-brand-lime/85 enabled:active:bg-brand-lime/75",
      danger:
        "bg-danger text-white enabled:hover:bg-danger/85 enabled:active:bg-danger/75",
      warning:
        "bg-warning text-white enabled:hover:bg-warning/85 enabled:active:bg-warning/75",
      neutral: "",
    },
  ],
  bordered: [
    "border",
    {
      black:
        "text-black bg-black/0 enabled:hover:bg-black/5 enabled:active:bg-black/10 border-black/50 enabled:hover:border-black/75",
      white:
        "text-white bg-white/0 enabled:hover:bg-white/5 enabled:active:bg-white/10 border-white/50 enabled:hover:border-white/75",
      primary:
        "text-brand-primary bg-brand-primary/0 enabled:hover:bg-brand-primary/5 enabled:active:bg-brand-primary/10 border-brand-primary/50 enabled:hover:border-brand-primary/75",
      secondary:
        "text-brand-secondary bg-brand-secondary/0 enabled:hover:bg-brand-secondary/5 enabled:active:bg-brand-secondary/10 border-brand-secondary/50 enabled:hover:border-brand-secondary/75",
      danger:
        "text-danger bg-danger/0 enabled:hover:bg-danger/5 enabled:active:bg-danger/10 border-danger/50 enabled:hover:border-danger/75",
      warning:
        "text-warning bg-warning/0 enabled:hover:bg-warning/5 enabled:active:bg-warning/10 border-warning/50 enabled:hover:border-warning/75",
      neutral: "",
    },
  ],
  icon: [
    "",
    {
      black:
        "text-black   bg-black/0 enabled:hover:bg-black/10 enabled:active:bg-black/20",
      white:
        "text-white   bg-black/0 enabled:hover:bg-black/10 enabled:active:bg-black/20",
      primary:
        "text-brand-primary bg-brand-primary/0 enabled:hover:bg-brand-primary/10 enabled:active:bg-brand-primary/20",
      secondary:
        "text-brand-secondary bg-brand-secondary/0 enabled:hover:bg-brand-secondary/10 enabled:active:bg-brand-secondary/20",
      danger:
        "text-danger bg-danger/0 enabled:hover:bg-danger/10 enabled:active:bg-danger/20",
      warning:
        "text-warning bg-warning/0 enabled:hover:bg-warning/10 enabled:active:bg-warning/20",
      neutral: "",
    },
  ],
};
