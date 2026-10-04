"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, type UseControllerProps } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { enGB } from "date-fns/locale/en-GB";
import { fi } from "date-fns/locale/fi";
import { InputBase } from "@/components/InputBase";
import { InputHelperText } from "@/components/InputHelperText";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";
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
  placeholder,
  className = "",
  error = false,
  helperText,
}: DateInputProps<T>) {
  const locale = useLocale();
  const messages = useTranslations(eventAdminMessages);
  const dateLocale = locale === "fi" ? fi : enGB;
  const dateFormat = locale === "fi" ? "dd.MM.yyyy" : "dd/MM/yyyy";
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    rules,
  });

  const selected =
    typeof value === "string" ? (nativeDate.form.parse(value) ?? null) : null;

  return (
    <div className="w-full">
      <InputBase error={error} className={className}>
        <DatePicker
          selected={selected}
          onChange={(date: Date | null) => {
            onChange(date ? nativeDate.form.stringify(date) : "");
          }}
          dateFormat={dateFormat}
          locale={dateLocale}
          strictParsing
          placeholderText={placeholder ?? messages.dateTime.datePlaceholder}
          className="w-full bg-transparent px-2 py-2 text-black outline-hidden placeholder:text-black/30"
        />
      </InputBase>
      <InputHelperText error={error}>{helperText}</InputHelperText>
    </div>
  );
}
