import React from "react";

export type FieldSetProps = {
  title: string;
  children?: React.ReactNode;
};

export function FieldSet(props: FieldSetProps) {
  return (
    <fieldset>
      <legend className="mb-2 block font-medium">{props.title}</legend>
      <div>{props.children}</div>
    </fieldset>
  );
}
