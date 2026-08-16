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
      <div className={props.fullWidth ? "w-full" : "inline-block"}>
        <InputBase {...props}>
          <textarea
            ref={ref}
            {...htmlProps}
            className="text-brand-dark w-full bg-transparent px-2 py-2 outline-hidden placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-500"
          />
        </InputBase>
        <InputHelperText error={props.error}>{helperText}</InputHelperText>
      </div>
    );
  },
);
