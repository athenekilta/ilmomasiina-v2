import { useRouter } from "next/router";
import { createUserSignUpSchema } from "../utils/userSignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";
import { routes } from "@/utils/routes";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import Link from "next/link";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export function RequestChangePasswordForm() {
  const router = useRouter();
  const messages = useTranslations(authMessages);
  const locale = useLocale();
  const userSchema = createUserSignUpSchema(messages.validation);
  const formSchema = z.object({ email: userSchema.shape.email });

  const {
    handleSubmit: createHandleSubmit,
    register,
    formState: {
      isSubmitting,
      errors: { email: emailError },
    },
  } = useForm<z.TypeOf<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = api.auth.passwordChange.request.useMutation();

  const handleSubmit = createHandleSubmit(async (values) => {
    await mutation.mutateAsync({ ...values, locale });
    router.push(routes.auth.password.requested);
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        fullWidth
        {...register("email")}
        startIcon={<Icon icon="mail" />}
        placeholder={messages.fields.email}
        helperText={emailError?.message}
        error={!!emailError}
      />

      <Button type="submit" color="primary" loading={isSubmitting}>
        {messages.actions.requestPasswordChange}
      </Button>

      {mutation.error && (
        <p role="alert" className="text-danger text-center">
          {messages.passwordChange.requestFailed}
        </p>
      )}

      <div className="flex items-center justify-between pt-6 text-black/70">
        <Link className="hover:underline" href={routes.auth.login}>
          {messages.actions.login}
        </Link>
      </div>
    </form>
  );
}
