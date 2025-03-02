import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { signIn } from "next-auth/react";
import { userSignUpSchema } from "../utils/userSignUpSchema";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import Link from "next/link";
import { routes } from "@/utils/routes";

export function SignupForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { error: queryError } = useQueryParams();

  const {
    register,
    handleSubmit: createHandleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const mutation = api.auth.singUp.useMutation();

  const handleSubmit = createHandleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    await signIn("credentials", values);
  });

  const errorMessage = queryError || mutation.error?.message;

  return (
    <form className="felx relative flex-col gap-12" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
      <Input
          {...register("name")}
          fullWidth
          placeholder="Name"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Input
          {...register("email")}
          fullWidth
          placeholder="Email"
          startIcon={<Icon icon="mail" />}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Input
          {...register("password")}
          fullWidth
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          startIcon={<Icon icon="lock" />}
          helperText={errors.password?.message}
          error={!!errors.password}
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

      <div className="flex flex-col gap-4 py-4">
        <Button type="submit" color="black" loading={isSubmitting}>
          Sign up
        </Button>
        {errorMessage && <p className="text-danger-700">{errorMessage}</p>}
      </div>
      <div className="flex items-center justify-between text-black">
        <Link className="font-thin hover:underline" href={routes.auth.login}>
          Login
        </Link>
      </div>
    </form>
  );
}
