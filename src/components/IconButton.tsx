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
    ref
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
  }
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
    "enabled:hover:bg-opacity-85 enabled:active:bg-opacity-75",
    {
      black: "  bg-black   text-white",
      white: "  bg-white   text-black",
      primary: "bg-primary text-white",
      secondary: "bg-secondary text-white",
      danger: " bg-danger  text-white",
      warning: "bg-warning text-white",
    },
  ],
  bordered: [
    "border bg-opacity-0 border-opacity-50 enabled:hover:bg-opacity-5 enabled:hover:border-opacity-60 enabled:active:bg-opacity-10 enabled:hover:border-opacity-70",
    {
      black: "  text-black   bg-black   border-black",
      white: "  text-white   bg-white   border-white",
      primary: "text-primary bg-primary border-primary",
      secondary: "text-secondary bg-secondary border-secondary",
      danger: " text-danger  bg-danger  border-danger",
      warning: "text-warning bg-warning border-warning",
    },
  ],
  icon: [
    "bg-opacity-0 enabled:hover:bg-opacity-10 enabled:active:bg-opacity-20",
    {
      black: "  text-black   bg-black",
      white: "  text-white   bg-white",
      primary: "text-primary bg-primary",
      secondary: "text-secondary bg-secondary",
      danger: " text-danger  bg-danger",
      warning: "text-warning bg-warning",
    },
  ],
};
