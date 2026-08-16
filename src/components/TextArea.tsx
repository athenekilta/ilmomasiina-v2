import React from "react";
import { InputBase } from "./InputBase";
import type { ExtensionInputBaseProps } from "./InputBase";
import { InputHelperText } from "./InputHelperText";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  ExtensionInputBaseProps & {
    helperText?: string;
  };

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(props, ref) {
    const { helperText, ...htmlProps } =
      InputBase.removeExtensionInputBaseProps(props);

    return (
      <InputBase {...props}>
        <textarea
          ref={ref}
          {...htmlProps}
          className="w-full bg-transparent px-2 py-2 text-brand-dark outline-hidden placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-500"
        />
        <InputHelperText error={props.error}>{helperText}</InputHelperText>
      </InputBase>
    );
  }
);
