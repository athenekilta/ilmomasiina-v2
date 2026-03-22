"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, type UseControllerProps } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { fi } from "date-fns/locale/fi";
import { InputBase } from "@/components/InputBase";
import { InputHelperText } from "@/components/InputHelperText";
import { nativeDate } from "@/utils/nativeDate";

type DateInputProps<T extends FieldValues = FieldValues> =
  UseControllerProps<T> & {
    placeholder?: string;
    className?: string;
    error?: boolean;
    helperText?: string;
  };

export function DateInput<T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  placeholder = "dd.mm.yyyy",
  className = "",
  error = false,
  helperText,
}: DateInputProps<T>) {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    rules,
  });

  const selected =
    typeof value === "string" ? nativeDate.form.parse(value) ?? null : null;

  return (
    <InputBase error={error} className={className}>
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => {
          onChange(date ? nativeDate.form.stringify(date) : "");
        }}
        dateFormat="dd.MM.yyyy"
        locale={fi}
        strictParsing
        placeholderText={placeholder}
        className="w-full bg-transparent px-2 py-2 text-black outline-hidden placeholder:text-black/30"
      />
      <InputHelperText error={error}>{helperText}</InputHelperText>
    </InputBase>
  );
}
