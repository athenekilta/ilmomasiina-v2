import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSignUpSchema } from "../utils/userSignUpSchema";
import { useRouter } from "next/router";
import { useManagementUser } from "../hooks/useManagementUser";
import { api } from "@/utils/api";
import { useQueryParams } from "@/hooks/useQueryParams";
import { routes } from "@/utils/routes";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export type RequestChangePasswordFormProps = {
  fixedEail?: string | undefined | null;
};

export function RequestEmailVerificationForm(
  props: RequestChangePasswordFormProps,
) {
  const router = useRouter();
  const messages = useTranslations(authMessages);
  const locale = useLocale();
  const userSchema = createUserSignUpSchema(messages.validation);
  const formSchema = z.object({ email: userSchema.shape.email });
  const user = useManagementUser();
  const requestMutation = api.auth.emailVerification.request.useMutation();
  const queryParams = useQueryParams();
  const email = props.fixedEail || queryParams.email || user.data?.email || "";

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
      email,
    },
  });

  const handleSubmit = createHandleSubmit(async (values) => {
    await requestMutation.mutateAsync({ ...values, locale });
    router.push(routes.auth.email.requestedVerification);
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        readOnly={!!props.fixedEail}
        fullWidth
        {...register("email")}
        startIcon={<Icon icon="mail" />}
        placeholder={messages.fields.email}
        helperText={emailError?.message}
        error={!!emailError}
      />

      {requestMutation.isSuccess ? (
        <p role="status">{messages.emailVerification.sentTo(email)}</p>
      ) : (
        <Button color="primary" type="submit" loading={isSubmitting}>
          {messages.actions.requestEmailVerification}
        </Button>
      )}

      <Button.Link href={routes.auth.login} color="primary" variant="bordered">
        {messages.actions.login}
      </Button.Link>

      {requestMutation.error && (
        <p role="alert" className="text-danger text-center">
          {messages.emailVerification.requestFailed}
        </p>
      )}
    </form>
  );
}
