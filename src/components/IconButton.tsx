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
    "relative flex flex-row items-center justify-center gap-4 rounded-control p-2 transition-[color,background-color,border-color,transform] duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-beige enabled:active:scale-[0.98]",
    variableButtonClassNames[props.variant ?? "icon"][0],
    variableButtonClassNames[props.variant ?? "icon"][1][
      props.color ?? "black"
    ],
  ];

  if (props.loading) classNameList.push("opacity-60");
  else if (props.disabled) classNameList.push("opacity-40");
  if (props.className) classNameList.push(props.className);

  if (!props.inputAdornment) classNameList.push("rounded-control");
  else if (props.inputAdornment === "start")
    classNameList.push("-ml-2 pl-3 rounded-control");
  else if (props.inputAdornment === "end")
    classNameList.push("-mr-2 pr-3 rounded-control");

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
        "bg-black text-white enabled:hover:bg-stone-800 enabled:active:bg-stone-900",
      white:
        "border border-stone-300 bg-brand-light text-brand-dark enabled:hover:bg-stone-100 enabled:active:bg-stone-200",
      primary:
        "bg-brand-primary text-white enabled:hover:bg-brand-secondary enabled:active:bg-brand-darkgreen",
      secondary:
        "bg-brand-lime text-brand-dark enabled:hover:bg-brand-primary enabled:hover:text-white enabled:active:bg-brand-secondary",
      danger:
        "bg-danger text-white enabled:hover:bg-rose-700 enabled:active:bg-rose-800",
      warning:
        "bg-warning text-white enabled:hover:bg-amber-600 enabled:active:bg-amber-700",
      neutral: "",
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
      neutral: "",
    },
  ],
  icon: [
    "",
    {
      black:
        "bg-stone-100 text-black enabled:hover:bg-stone-200 enabled:active:bg-stone-300",
      white:
        "bg-white text-brand-primary enabled:hover:bg-brand-beige enabled:active:bg-brand-lime",
      primary:
        "bg-brand-beige text-brand-primary enabled:hover:bg-brand-lime enabled:active:bg-brand-primary enabled:active:text-white",
      secondary:
        "bg-brand-lime text-brand-dark enabled:hover:bg-brand-primary enabled:hover:text-white enabled:active:bg-brand-secondary",
      danger:
        "bg-rose-50 text-danger enabled:hover:bg-rose-100 enabled:active:bg-rose-200",
      warning:
        "bg-amber-50 text-warning enabled:hover:bg-amber-100 enabled:active:bg-amber-200",
      neutral: "",
    },
  ],
};
