import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTranslations } from "@/i18n/I18nProvider";
import { settingsMessages } from "@/i18n/messages/settings";
import { managementChangePassword } from "@/server/auth/management-auth-client";

export function ManagementPasswordForm() {
  const { password: messages } = useTranslations(settingsMessages);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const schema = z
    .object({
      currentPassword: z.string().min(1, messages.required),
      newPassword: z.string().min(8, messages.length).max(128, messages.length),
      confirmPassword: z.string(),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: messages.mismatch,
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const submit = handleSubmit(async ({ currentPassword, newPassword }) => {
    setResult(null);
    try {
      const response = await managementChangePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (response.error) {
        setResult("error");
        return;
      }
      reset();
      setResult("success");
    } catch {
      setResult("error");
    }
  });

  return (
    <form
      onSubmit={submit}
      onChange={() => setResult(null)}
      className="mb-6 space-y-4"
    >
      <p className="text-sm text-stone-600">{messages.description}</p>
      {(
        [
          ["currentPassword", messages.current, "current-password"],
          ["newPassword", messages.next, "new-password"],
          ["confirmPassword", messages.confirm, "new-password"],
        ] as const
      ).map(([name, label, autoComplete]) => (
        <div key={name}>
          <label htmlFor={name} className="mb-1 block text-sm font-medium">
            {label}
          </label>
          <Input
            {...register(name)}
            id={name}
            type="password"
            autoComplete={autoComplete}
            fullWidth
            disabled={isSubmitting}
            error={!!errors[name]}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
          {errors[name] && (
            <p id={`${name}-error`} className="text-danger mt-1 text-sm">
              {errors[name]?.message}
            </p>
          )}
        </div>
      ))}
      <Button type="submit" loading={isSubmitting}>
        {messages.submit}
      </Button>
      {result === "success" && (
        <p role="status" className="text-sm">
          {messages.success}
        </p>
      )}
      {result === "error" && (
        <p role="alert" className="text-danger text-sm">
          {messages.failed}
        </p>
      )}
    </form>
  );
}
