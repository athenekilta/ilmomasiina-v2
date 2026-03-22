"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, type UseControllerProps } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { fi } from "date-fns/locale/fi";
import { InputBase } from "@/components/InputBase";
import { InputHelperText } from "@/components/InputHelperText";

type TimeInputProps<T extends FieldValues = FieldValues> =
  UseControllerProps<T> & {
    placeholder?: string;
    className?: string;
    error?: boolean;
    helperText?: string;
  };

export function TimeInput<T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  placeholder = "Valitse aika",
  className = "",
  error = false,
  helperText,
}: TimeInputProps<T>) {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    rules,
  });

  const selected = value
    ? (() => {
        const d = new Date(`2000-01-01T${value}`);
        return isNaN(d.getTime()) ? null : d;
      })()
    : null;

  return (
    <InputBase error={error} className={className}>
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => {
          if (!date) {
            onChange("");
            return;
          }

          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          onChange(`${hours}:${minutes}`);
        }}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Aika"
        dateFormat="HH:mm"
        locale={fi}
        placeholderText={placeholder}
        className="w-full bg-transparent px-2 py-2 text-black outline-hidden placeholder:text-black/30"
      />
      <InputHelperText error={error}>{helperText}</InputHelperText>
    </InputBase>
  );
}
