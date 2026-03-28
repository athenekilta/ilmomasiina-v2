import React from "react";

export type FieldSetProps = {
  title: string;
  children?: React.ReactNode;
};

export function FieldSet(props: FieldSetProps) {
  return (
    <fieldset>
      <legend className="mb-3 block text-sm font-semibold text-brand-dark">
        {props.title}
      </legend>
      <div>{props.children}</div>
    </fieldset>
  );
}
