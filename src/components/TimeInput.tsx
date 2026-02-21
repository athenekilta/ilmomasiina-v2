"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, type UseControllerProps } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { c } from "@/utils/classnames";

type TimeInputProps<T extends FieldValues = FieldValues> =
  UseControllerProps<T> & {
    placeholder?: string;
    className?: string;
    error?: boolean;
  };

export function TimeInput<T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  placeholder = "Valitse aika",
  className = "",
  error = false,
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
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            onChange(`${hours}:${minutes}`);
          }
        }}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Aika"
        dateFormat="HH:mm"
        locale="fi"
        placeholderText={placeholder}
        className="w-full bg-transparent px-2 py-2 text-black outline-hidden placeholder:text-black/30"
      />
    </div>
  );
}
