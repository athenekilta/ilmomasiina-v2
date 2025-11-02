import type { InputProps } from "@/components/Input";
import { Input } from "@/components/Input";
import { onBlurDeep } from "@/utils/onBlurDeep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ZodSafe } from "@/types/types";
import { c } from "@/utils/classnames";

export type TextInputFormProps = {
  onSubmit(value: string): void;
  schema: ZodSafe<z.ZodString>;
  defaultValue: string;
} & Omit<InputProps, "onSubmit">;

export function TextInputForm({
  onSubmit,
  schema,
  defaultValue,
  ...InputProps
}: TextInputFormProps) {
  const formSchema = z.object({ value: schema });

  const {
    handleSubmit,
    register,
    formState: {
      errors: { value: error },
    },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
    reValidateMode: "onBlur",
  });

  const [isEditing, setIsEditing] = useState(false);

  const submit = handleSubmit(async ({ value }) => {
    setIsEditing(false);
    await onSubmit(value);
  });

  return (
    <form
      className="relative"
      onFocus={() => setIsEditing(true)}
      onSubmit={submit}
      onBlur={onBlurDeep(submit)}
    >
      <Input
        readOnly={!isEditing}
        className={c("flex-1", isEditing ? "" : "bg-white")}
        onClick={() => setIsEditing(true)}
        error={!!error}
        helperText={error?.message ? String(error?.message) : undefined}
        {...register("value")}
        {...InputProps}
      />
    </form>
  );
}
