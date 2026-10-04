import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { managementSignIn } from "@/server/auth/management-auth-client";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import Link from "next/link";
import { routes } from "@/utils/routes";
import { useState } from "react";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export function LoginForm() {
  const messages = useTranslations(authMessages);
  const formSchema = z.object({
    email: z.string().email(messages.validation.invalidEmail),
    password: z.string().min(8, messages.validation.passwordTooShort(8)),
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const { error: queryError } = useQueryParams();

  const {
    register,
    handleSubmit: createHandleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = createHandleSubmit(async (values) => {
    setLoginError(undefined);

    try {
      const result = await managementSignIn.email(values);
      if (result.error) {
        setLoginError(messages.login.invalidCredentials);
      }
    } catch {
      setLoginError(messages.login.failed);
    }
  });

  const errorMessage =
    loginError ?? (queryError ? messages.login.failed : undefined);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col gap-6"
    >
      <div className="flex flex-col gap-6">
        <Input
          {...register("email")}
          fullWidth
          startIcon={<Icon icon="mail" />}
          placeholder={messages.fields.email}
          helperText={errors.email?.message}
          error={!!errors.email}
        />
        <Input
          {...register("password")}
          fullWidth
          type={isPasswordVisible ? "text" : "password"}
          startIcon={<Icon icon="lock" />}
          placeholder={messages.fields.password}
          helperText={errors.password?.message}
          error={!!errors.password}
          endIcon={
            <IconButton
              tabIndex={-1}
              type="button"
              aria-label={
                isPasswordVisible
                  ? messages.actions.hidePassword
                  : messages.actions.showPassword
              }
              onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
              inputAdornment="end"
            >
              <Icon
                icon={isPasswordVisible ? "visibility" : "visibility_off"}
              />
            </IconButton>
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" color="primary" loading={isSubmitting}>
          {messages.actions.login}
        </Button>
        {errorMessage && (
          <p role="alert" aria-live="polite" className="text-danger-700">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-black">
        <Link className="font-thin hover:underline" href={routes.auth.signup}>
          {messages.actions.createAccount}
        </Link>
      </div>
    </form>
  );
}
