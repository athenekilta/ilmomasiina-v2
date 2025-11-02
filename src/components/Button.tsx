import type { LinkProps } from "next/link";
import Link from "next/link";
import React, { forwardRef } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import type { ColorVariant } from "@/types/types";

export type ButtonVariant = "filled" | "bordered" | "text";
export type ButtonSize = "small" | "default";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: ButtonVariant;
  color?: ColorVariant;
  children?: React.ReactNode;
  size?: ButtonSize;
  stopPropagation?: boolean;
};

export type ButtonLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    loading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: ButtonVariant;
    color?: ColorVariant;
    children?: React.ReactNode;
    size?: ButtonSize;
    stopPropagation?: boolean;
  };

export const Button = Object.assign(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      loading,
      startIcon,
      endIcon,
      variant,
      color,
      children,
      className,
      size,
      onClick,
      stopPropagation,
      ...htmlProps
    },
    ref,
  ) {
    return (
      <button
        {...htmlProps}
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          onClick?.(e);
        }}
        ref={ref}
        disabled={loading || htmlProps.disabled}
        className={getClassName({
          loading,
          variant,
          color,
          className,
          size,
          disabled: htmlProps.disabled,
          startIcon: !!startIcon,
          endIcon: !!endIcon,
        })}
      >
        {
          // Loading icon
          loading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )
        }

        {startIcon}
        {children}
        {endIcon}
      </button>
    );
  }),
  {
    Link: function LinkButton({
      startIcon,
      endIcon,
      variant,
      color,
      className,
      children,
      loading,
      size,
      onClick,
      stopPropagation,
      ...htmlProps
    }: ButtonLinkProps) {
      return (
        <Link
          {...htmlProps}
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
            onClick?.(e);
          }}
          className={getClassName({
            loading,
            variant,
            color,
            className,
            size,
            startIcon: !!startIcon,
            endIcon: !!endIcon,
          })}
        >
          {startIcon}
          {children}
          {endIcon}
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
  variant?: ButtonVariant;
  color?: ColorVariant;
  className?: string;
  startIcon?: boolean;
  endIcon?: boolean;
  size?: ButtonSize;
}) {
  const classNameList = [
    "relative cursor-pointer flex items-center justify-center rounded-lg font-medium",
    variableButtonClassNames[props.variant ?? "filled"][0],
    variableButtonClassNames[props.variant ?? "filled"][1][
      props.color ?? "primary"
    ],
    props.size === "small" ? "pl-2" : props.startIcon ? "pl-2" : "pl-4",
    props.size === "small" ? "pr-2" : props.endIcon ? "pr-2" : "pr-4",
    props.size === "small"
      ? "gap-1 py-1 text-[0.8rem]"
      : "py-2 text-[0.9rem] min-h-9 gap-4",
  ];

  if (props.loading) classNameList.push("opacity-60");
  else if (props.disabled) classNameList.push("opacity-40");
  if (props.className) classNameList.push(props.className);

  return classNameList.join(" ");
}

const variableButtonClassNames: Record<
  ButtonVariant,
  [string, Record<ColorVariant, string>]
> = {
  filled: [
    "",
    {
      black:
        "bg-black text-white enabled:hover:bg-black/75 enabled:active:bg-black/70",
      white:
        "bg-white text-black enabled:hover:bg-black/75 enabled:active:bg-black/70",
      primary:
        "bg-brand-primary text-white enabled:hover:bg-brand-primary/75 enabled:active:bg-brand-primary/70",
      secondary:
        "bg-brand-lime text-black enabled:hover:bg-brand-lime/75 enabled:active:bg-brand-lime/70",
      danger:
        "bg-danger text-white enabled:hover:bg-danger/75 enabled:active:bg-danger/70",
      warning:
        "bg-warning text-white enabled:hover:bg-warning/75 enabled:active:bg-warning/70",
    },
  ],
  bordered: [
    "border",
    {
      black:
        "text-black bg-black/0 enabled:hover:bg-black/15 enabled:active:bg-black/10 border-black/50 enabled:hover:border-black/70",
      white:
        "text-white bg-white/0 enabled:hover:bg-white/15 enabled:active:bg-white/10 border-white/50 enabled:hover:border-white/70",
      primary:
        "text-brand-primary bg-brand-primary/0 enabled:hover:bg-brand-primary/15 enabled:active:bg-brand-primary/10 border-brand-primary/50 enabled:hover:border-brand-primary/70",
      secondary:
        "text-brand-secondary bg-brand-secondary/0 enabled:hover:bg-brand-secondary/15 enabled:active:bg-brand-secondary/10 border-brand-secondary/50 enabled:hover:border-brand-secondary/70",
      danger:
        "text-danger bg-danger/0 enabled:hover:bg-danger/15 enabled:active:bg-danger/10 border-danger/50 enabled:hover:border-danger/70",
      warning:
        "text-warning bg-warning/0 enabled:hover:bg-warning/15 enabled:active:bg-warning/10 border-warning/50 enabled:hover:border-warning/70",
    },
  ],
  text: [
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
    },
  ],
};
