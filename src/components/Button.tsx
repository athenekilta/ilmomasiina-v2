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
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingSpinner />
          </div>
        )}

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
    "relative flex cursor-pointer items-center justify-center rounded-control font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-beige enabled:active:scale-[0.98]",
    variableButtonClassNames[props.variant ?? "filled"][0],
    variableButtonClassNames[props.variant ?? "filled"][1][
      props.color ?? "primary"
    ],
    props.size === "small" ? "pl-2" : props.startIcon ? "pl-2" : "pl-4",
    props.size === "small" ? "pr-2" : props.endIcon ? "pr-2" : "pr-4",
    props.size === "small"
      ? "gap-1 py-1 text-[0.8rem]"
      : "py-2 text-[0.9rem] min-h-9 gap-2",
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
        "bg-black text-white enabled:hover:bg-stone-800 enabled:active:bg-stone-900",
      white:
        "border border-stone-300 bg-brand-light text-brand-dark enabled:hover:bg-stone-100 enabled:active:bg-stone-200",
      primary:
        "bg-brand-primary text-white shadow-soft enabled:hover:bg-brand-secondary enabled:hover:shadow-soft enabled:active:bg-brand-darkgreen",
      secondary:
        "bg-brand-secondary text-white enabled:hover:bg-brand-darkgreen enabled:active:bg-stone-800",
      danger:
        "bg-danger text-white enabled:hover:bg-rose-700 enabled:active:bg-rose-800",
      warning:
        "bg-warning text-white enabled:hover:bg-amber-600 enabled:active:bg-amber-700",
      neutral:
        "bg-stone-200 text-brand-dark enabled:hover:bg-stone-300 enabled:active:bg-stone-400",
    },
  ],
  bordered: [
    "border-2",
    {
      black:
        "border-stone-900 bg-stone-800 text-white enabled:hover:bg-stone-900 enabled:active:bg-black",
      white:
        "border-white bg-brand-secondary text-white enabled:hover:bg-brand-darkgreen enabled:active:bg-stone-900",
      primary:
        "border-brand-secondary bg-brand-beige text-brand-dark enabled:hover:bg-brand-lime enabled:active:bg-brand-primary enabled:active:text-white",
      secondary:
        "border-brand-secondary bg-brand-lime text-brand-dark enabled:hover:bg-brand-primary enabled:hover:text-white enabled:active:bg-brand-secondary",
      danger:
        "border-rose-700 bg-rose-100 text-rose-900 enabled:hover:bg-rose-200 enabled:active:bg-rose-300",
      warning:
        "border-amber-600 bg-amber-100 text-amber-950 enabled:hover:bg-amber-200 enabled:active:bg-amber-300",
      neutral:
        "border-stone-500 bg-stone-200 text-brand-dark enabled:hover:bg-stone-300 enabled:active:bg-stone-400",
    },
  ],
  text: [
    "",
    {
      black:
        "bg-stone-100 text-black enabled:hover:bg-stone-200 enabled:active:bg-stone-300",
      white:
        "bg-white text-brand-primary enabled:hover:bg-brand-beige enabled:active:bg-brand-lime enabled:active:text-brand-dark",
      primary:
        "bg-brand-beige text-brand-dark enabled:hover:bg-brand-lime enabled:active:bg-brand-primary enabled:active:text-white",
      secondary:
        "bg-brand-lime text-brand-dark enabled:hover:bg-brand-primary enabled:hover:text-white enabled:active:bg-brand-secondary",
      danger:
        "bg-rose-50 text-danger enabled:hover:bg-rose-100 enabled:active:bg-rose-200",
      warning:
        "bg-amber-50 text-warning enabled:hover:bg-amber-100 enabled:active:bg-amber-200",
      neutral:
        "bg-stone-200 text-brand-dark enabled:hover:bg-stone-300 enabled:active:bg-stone-400",
    },
  ],
};