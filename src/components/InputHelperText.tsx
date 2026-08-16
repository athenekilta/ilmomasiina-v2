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
        "absolute top-full pt-1 text-xs leading-snug " +
        (props.error
          ? "font-medium text-danger"
          : "text-gray-600")
      }
    >
      {props.children}
    </span>
  );
}
