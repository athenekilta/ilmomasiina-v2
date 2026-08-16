import React from "react";

export type InputHelperTextProps = {
  children?: React.ReactNode;
  error?: boolean;
};

export function InputHelperText(props: InputHelperTextProps) {
  if (!props.children) return null;

  return (
    <span
      data-error={props.error}
      className={
        // Flows below the field instead of floating on top of whatever
        // comes next: as an absolutely positioned element it reserved no
        // space, so validation messages landed under the following input.
        "mt-1 block text-xs leading-snug " +
        (props.error ? "text-danger font-medium" : "text-gray-600")
      }
    >
      {props.children}
    </span>
  );
}
