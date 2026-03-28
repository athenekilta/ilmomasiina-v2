import { c } from "@/utils/classnames";
import { forwardRef } from "react";

export type ExtensionInputBaseProps = {
  startIcon?: React.ReactNode;
  startLabel?: string;
  endIcon?: React.ReactNode;
  endLabel?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  baseClassName?: string;
};

export type InputBaseProps = ExtensionInputBaseProps & {
  readOnly?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const InputBase = Object.assign(
  forwardRef<HTMLDivElement, InputBaseProps>(function InputBase(props, ref) {
    return (
      <div
        ref={ref}
        className={c(
          "group relative flex items-center rounded-control border border-stone-300 bg-brand-light shadow-soft transition-[border-color,box-shadow] duration-200",

          // Full width
          c.if(props.fullWidth)("w-full"),

          // Disabled and read only
          c
            .if(props.disabled)("opacity-60")
            .elseIf(props.readOnly)("cursor-text")
            .else("cursor-pointer hover:border-stone-400"),

          // Error state
          c.if(props.error)("border-danger"),

          !props.readOnly &&
            !props.disabled &&
            c.if(props.error)(
              "group-focus-within:border-danger group-focus-within:ring-0",
            ).else(
              "group-focus-within:border-brand-secondary group-focus-within:ring-0",
            ),

          props.className,

          props.baseClassName,
        )}
      >
        {props.startIcon && (
          <span className="px-2 text-gray-500">{props.startIcon}</span>
        )}

        {props.startLabel && (
          <span className="px-2 whitespace-nowrap text-black">
            {props.startLabel}
          </span>
        )}

        {props.children}

        {props.endLabel && (
          <span className="ml-auto px-2 whitespace-nowrap text-black">
            {props.endLabel}
          </span>
        )}

        {props.endIcon && (
          <span className="ml-auto px-2 text-gray-500">{props.endIcon}</span>
        )}
      </div>
    );
  }),
  {
    extractInputBaseProps<T extends InputBaseProps>(props: T): InputBaseProps {
      /* eslint-disable */
      const {
        children,
        readOnly,
        fullWidth,
        startIcon,
        startLabel,
        endIcon,
        endLabel,
        error,
        disabled,
        baseClassName,
      } = props;
      return {
        children,
        readOnly,
        fullWidth,
        startIcon,
        startLabel,
        endIcon,
        endLabel,
        error,
        disabled,
        baseClassName,
      };
    },
    removeExtensionInputBaseProps<T extends ExtensionInputBaseProps>(
      props: T,
    ): Omit<T, keyof ExtensionInputBaseProps> {
      const {
        fullWidth,
        startIcon,
        startLabel,
        endIcon,
        endLabel,
        error,
        disabled,
        baseClassName,
        ...rest
      } = props;

      return rest;
    },
    removeInputBaseProps<T extends InputBaseProps>(
      props: T,
    ): Omit<T, keyof InputBaseProps> {
      const {
        children,
        readOnly,
        fullWidth,
        startIcon,
        startLabel,
        endIcon,
        endLabel,
        error,
        disabled,
        className,
        baseClassName,
        ...rest
      } = props;

      /* eslint-enable */
      return rest;
    },
  },
);
