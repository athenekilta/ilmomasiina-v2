import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpSchema } from "../utils/userSignUpSchema";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import { api } from "@/utils/api";
import { useQueryParams } from "@/hooks/useQueryParams";
import { routes } from "@/utils/routes";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";

const formSchem = z.object({
  email: userSignUpSchema.shape.email,
});

export type RequestChangePasswordFormProps = {
  fixedEail?: string | undefined | null;
};

export function RequestEmailVerificationForm(
  props: RequestChangePasswordFormProps
) {
  const router = useRouter();
  const user = useUser();
  const requestMutation = api.auth.passwordChange.request.useMutation();
  const queryParams = useQueryParams();
  const email = props.fixedEail || queryParams.email || user.data?.email || "";

  const {
    handleSubmit: createHandleSubmit,
    register,
    formState: {
      isSubmitting,
      errors: { email: emailError },
    },
  } = useForm<z.TypeOf<typeof formSchem>>({
    resolver: zodResolver(formSchem),
    defaultValues: {
      email,
    },
  });

  const handleSubmit = createHandleSubmit(async (values) => {
    await requestMutation.mutateAsync(values);
    router.push(routes.auth.email.requestedVerification);
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        readOnly={!!props.fixedEail}
        fullWidth
        {...register("email")}
        startIcon={<Icon icon="mail" />}
        placeholder="Email"
        helperText={emailError?.message}
        error={!!emailError}
      />

      {requestMutation.isSuccess ? (
        <p> Email sent Successfuly to {email}</p>
      ) : (
        <Button color="primary" type="submit" loading={isSubmitting}>
          Request Email Verification
        </Button>
      )}

      <Button.Link
        href={routes.auth.login}
        color="primary"
        variant="bordered"
        loading={isSubmitting}
      >
        Login
      </Button.Link>
    </form>
  );
}
