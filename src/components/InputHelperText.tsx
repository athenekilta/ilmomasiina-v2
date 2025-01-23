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
      className="absolute top-[100%] pt-1 text-sm text-danger data-[error=true]:text-danger"
    >
      {props.children}
    </span>
  );
}
