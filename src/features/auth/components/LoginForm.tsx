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

const formschema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const { error: queryError } = useQueryParams();

  const {
    register,
    handleSubmit: createHandleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(formschema),
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
        setLoginError("Invalid email or password.");
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    }
  });

  const errorMessage = loginError ?? queryError;

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
          placeholder="Email"
          //   helperText={errors?.email?.message} TODO: fix
          error={!!errors.email}
        />
        <Input
          {...register("password")}
          fullWidth
          type={isPasswordVisible ? "text" : "password"}
          startIcon={<Icon icon="lock" />}
          placeholder="Password"
          endIcon={
            <IconButton
              tabIndex={-1}
              type="button"
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
          Login
        </Button>
        {errorMessage && (
          <p role="alert" aria-live="polite" className="text-danger-700">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-black">
        <Link className="font-thin hover:underline" href={routes.auth.signup}>
          Create an account
        </Link>
      </div>
    </form>
  );
}
