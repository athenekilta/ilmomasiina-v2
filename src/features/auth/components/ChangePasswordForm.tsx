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

const formschema = z.object({
  password: z.string().min(8),
});

export function ChangePasswordForm() {
  const router = useRouter();

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
  } = useForm<z.TypeOf<typeof formschema>>({
    resolver: zodResolver(formschema),
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
        className="text-center text-black/70 data-[status=error]:text-danger"
      >
        {tokenQuery.error
          ? "Invalid token"
          : token
            ? "syötä uusi salasana alle käyttäjälle " + tokenQuery.data
            : "loading..."}
      </p>

      <div className="flex flex-col gap-6">
        <Input
          fullWidth
          {...register("password")}
          startIcon={<Icon icon="lock" />}
          endIcon={
            <IconButton
              tabIndex={-1}
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
          Change password
        </Button>

        {mutation.error && (
          <p className="text-danger">{mutation.error.message}</p>
        )}

        <div className="flex items-center justify-between pt-6 text-black/70">
          <Link className="hover:underline" href={routes.auth.login}>
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
