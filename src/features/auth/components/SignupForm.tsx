import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryParams } from "@/hooks/useQueryParams";

import {
  managementSignIn,
  managementSignUp,
} from "@/server/auth/management-auth-client";
import { createUserSignUpSchema } from "../utils/userSignUpSchema";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import Link from "next/link";
import { routes } from "@/utils/routes";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export function SignupForm() {
  const messages = useTranslations(authMessages);
  const formSchema = createUserSignUpSchema(messages.validation);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [signupError, setSignupError] = useState<string>();
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
      name: "",
    },
  });

  const handleSubmit = createHandleSubmit(async (values) => {
    setSignupError(undefined);
    try {
      const result = await managementSignUp.email(values);
      if (result.error) {
        setSignupError(messages.signup.failed);
        return;
      }
      await managementSignIn.email(values);
    } catch {
      setSignupError(messages.signup.failed);
    }
  });

  const errorMessage =
    signupError ?? (queryError ? messages.signup.failed : undefined);

  return (
    <form
      className="relative flex w-full flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input
          {...register("name")}
          fullWidth
          placeholder={messages.fields.name}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <Input
          {...register("email")}
          fullWidth
          placeholder={messages.fields.email}
          startIcon={<Icon icon="mail" />}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Input
          {...register("password")}
          fullWidth
          type={isPasswordVisible ? "text" : "password"}
          placeholder={messages.fields.password}
          startIcon={<Icon icon="lock" />}
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

      <div className="flex flex-col gap-4 py-4">
        <Button type="submit" color="black" loading={isSubmitting}>
          {messages.actions.signup}
        </Button>
        {errorMessage && (
          <p role="alert" className="text-danger-700">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between text-black">
        <Link className="font-thin hover:underline" href={routes.auth.login}>
          {messages.actions.login}
        </Link>
      </div>
    </form>
  );
}
