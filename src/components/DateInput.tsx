"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, type UseControllerProps } from "react-hook-form";
import { format } from "date-fns";
import type { FieldValues } from "react-hook-form";
import { c } from "@/utils/classnames";

type DateInputProps<T extends FieldValues = FieldValues> =
  UseControllerProps<T> & {
    placeholder?: string;
    className?: string;
    error?: boolean;
  };

export function DateInput<T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  placeholder = "Valitse päivämäärä",
  className = "",
  error = false,
}: DateInputProps<T>) {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    rules,
  });

  const selected = value
    ? (() => {
        const d = new Date(value as unknown as string);
        return isNaN(d.getTime()) ? null : d;
      })()
    : null;

  return (
    <div
      className={c(
        "group relative flex items-center rounded-lg border bg-white",
        c.if(!error)("border-gray-300"),
        c.if(error)("border-danger"),
        className,
      )}
    >
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => {
          if (date) {
            const formatted = format(date, "yyyy-MM-dd");
            onChange(formatted);
          }
        }}
        dateFormat="d.M.yyyy"
        locale="fi"
        placeholderText={placeholder}
        className="w-full bg-transparent px-2 py-2 text-black outline-hidden placeholder:text-black/30"
      />
    </div>
  );
}
