import React from "react";

export type FieldSetProps = {
  title: string;
  /**
   * `"field"` (the default) labels one input. `"section"` heads a whole block
   * of the form — quotas, questions, the signup list — and takes the same
   * signpost voice those headings have everywhere else in the product.
   *
   * The two were one style before, which is why a form full of fields read as
   * a form full of sections.
   */
  level?: "field" | "section";
  children?: React.ReactNode;
};

export function FieldSet({ title, level = "field", children }: FieldSetProps) {
  return (
    <fieldset>
      <legend
        className={
          level === "section"
            ? "eyebrow text-brand-secondary mb-3 block"
            : "text-brand-dark mb-1.5 block text-sm font-semibold"
        }
      >
        {title}
      </legend>
      {/* Stretches whatever it holds. An `Input` sizes itself to its content
          unless told otherwise, so without this every plain text field came
          out about twenty characters wide and clipped its own value, while
          the ones that happened to sit in a flex wrapper filled the row. */}
      <div className="flex w-full flex-col">{children}</div>
    </fieldset>
  );
}
