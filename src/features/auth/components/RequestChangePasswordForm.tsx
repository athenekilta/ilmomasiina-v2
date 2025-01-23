import { useRouter } from "next/router";
import { userSignUpSchema } from "../utils/userSignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";
import { routes } from "@/utils/routes";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import Link from "next/link";

const formSchema = z.object({
  email: userSignUpSchema.shape.email,
});

export function RequestChangePasswordForm() {
  const router = useRouter();

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
    await mutation.mutateAsync(values);
    router.push(routes.auth.password.requested);
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        fullWidth
        {...register("email")}
        startIcon={<Icon icon="mail" />}
        placeholder="Email"
        helperText={emailError?.message}
        error={!!emailError}
      />

      <Button type="submit" color="primary" loading={isSubmitting}>
        Request password change link
      </Button>

      {mutation.error && (
        <p className="text-center text-danger">{mutation.error.message}</p>
      )}

      <div className="flex items-center justify-between pt-6 text-black/70">
        <Link className="hover:underline" href={routes.auth.login}>
          Login
        </Link>
      </div>
    </form>
  );
}
