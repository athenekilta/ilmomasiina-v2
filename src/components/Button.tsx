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
    ref
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
  }
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
    "relative flex items-center justify-center rounded-lg font-medium",
    variableButtonClassNames[props.variant ?? "filled"][0],
    variableButtonClassNames[props.variant ?? "filled"][1][
      props.color ?? "primary"
    ],
    props.size === "small" ? "pl-2" : props.startIcon ? "pl-2" : "pl-4",
    props.size === "small" ? "pr-2" : props.endIcon ? "pr-2" : "pr-4",
    props.size === "small"
      ? "gap-1 py-1 text-[0.8rem]"
      : "py-2 text-[0.9rem] min-h-[2.25rem] gap-4",
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
    "enabled:hover:bg-opacity-75 enabled:active:bg-opacity-70",
    {
      black: "bg-black text-white",
      white: "bg-white text-black",
      primary: "bg-brand-primary text-white",
      secondary: "bg-brand-lime text-black",
      danger: "bg-danger text-white",
      warning: "bg-warning text-white",
    },
  ],
  bordered: [
    "border bg-opacity-0 border-opacity-50 enabled:hover:bg-opacity-15 enabled:hover:border-opacity-60 enabled:active:bg-opacity-10 enabled:hover:border-opacity-70",
    {
      black: "text-black bg-black border-black",
      white: "text-white bg-white border-white",
      primary: "text-brand-primary bg-brand-primary border-brand-primary",
      secondary:
        "text-brand-secondary bg-brand-secondary border-brand-secondary",
      danger: "text-danger  bg-danger  border-danger",
      warning: "text-warning bg-warning border-warning",
    },
  ],
  text: [
    "bg-opacity-0 enabled:hover:bg-opacity-10 enabled:active:bg-opacity-20",
    {
      black: "text-black   bg-black",
      white: "text-white   bg-white",
      primary: "text-brand-primary bg-brand-primary",
      secondary: "text-brand-secondary bg-brand-secondary",
      danger: "text-danger  bg-danger",
      warning: "text-warning bg-warning",
    },
  ],
};
