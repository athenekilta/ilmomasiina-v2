import React from "react";
import type { ExtensionInputBaseProps } from "./InputBase";
import { InputBase } from "./InputBase";
import { InputHelperText } from "./InputHelperText";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  ExtensionInputBaseProps & {
    helperText?: string;
  };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { helperText, ...htmlProps } =
      InputBase.removeExtensionInputBaseProps(props);
    return (
      <InputBase {...props}>
        <input
          ref={ref}
          disabled={props.disabled}
          {...htmlProps}
          className="w-full bg-transparent px-2 py-2 text-brand-dark outline-hidden placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-500"
        />
        <InputHelperText error={props.error}>{helperText}</InputHelperText>
      </InputBase>
    );
  },
);
