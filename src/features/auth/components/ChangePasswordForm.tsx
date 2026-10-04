import { z } from "zod";
import { useRouter } from "next/router";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/utils/routes";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import Link from "next/link";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export function ChangePasswordForm() {
  const router = useRouter();
  const messages = useTranslations(authMessages);
  const formSchema = z.object({
    password: z.string().min(8, messages.validation.passwordTooShort(8)),
  });

  const token = useQueryParams().token ?? "";
  const tokenQuery = api.auth.passwordChange.validate.useQuery({ token });

  const [passwordHidden, setPasswordHidden] = useState(true);

  const {
    handleSubmit: createHandleSubmit,
    register,
    formState: {
      isSubmitting,
      errors: { password: passwordError },
    },
  } = useForm<z.TypeOf<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const mutation = api.auth.passwordChange.change.useMutation();

  const handleSubmit = createHandleSubmit(async (values) => {
    if (!token) return;
    await mutation.mutateAsync({ password: values.password, token });
    router.push(routes.auth.password.changed);
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p
        data-status={tokenQuery.status}
        className="data-[status=error]:text-danger text-center text-black/70"
      >
        {tokenQuery.error
          ? messages.passwordChange.invalidToken
          : tokenQuery.data
            ? messages.passwordChange.enterNewPassword(tokenQuery.data)
            : messages.passwordChange.loading}
      </p>

      <div className="flex flex-col gap-6">
        <Input
          fullWidth
          {...register("password")}
          startIcon={<Icon icon="lock" />}
          endIcon={
            <IconButton
              tabIndex={-1}
              type="button"
              aria-label={
                passwordHidden
                  ? messages.actions.showPassword
                  : messages.actions.hidePassword
              }
              onClick={() => setPasswordHidden((prev) => !prev)}
              inputAdornment="end"
            >
              <Icon icon={passwordHidden ? "visibility" : "visibility_off"} />
            </IconButton>
          }
          type={passwordHidden ? "password" : "text"}
          placeholder="********"
          helperText={passwordError?.message}
          error={!!passwordError}
        ></Input>

        <Button
          type="submit"
          color="primary"
          loading={isSubmitting}
          disabled={tokenQuery.isError}
        >
          {messages.actions.changePassword}
        </Button>

        {mutation.error && (
          <p role="alert" className="text-danger">
            {messages.passwordChange.changeFailed}
          </p>
        )}

        <div className="flex items-center justify-between pt-6 text-black/70">
          <Link className="hover:underline" href={routes.auth.login}>
            {messages.actions.login}
          </Link>
        </div>
      </div>
    </form>
  );
}
