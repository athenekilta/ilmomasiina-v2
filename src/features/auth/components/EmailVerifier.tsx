import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Button } from "@/components/Button";
import { routes } from "@/utils/routes";

export function EmailVerifier() {
  const user = useUser();
  const apiContext = api.useContext();

  const queryParams = useQueryParams();
  const email = queryParams.email || user.data?.email || "";
  const token = queryParams.token || "";

  const [didReRequest, setDidReRequest] = useState(false);

  const tokenMutation = api.auth.emailVerification.verify.useMutation({
    onMutate() {
      setDidReRequest(false);
    },
    onError() {
      setDidReRequest(true);
    },
    onSuccess() {
      apiContext.profile.invalidate();
    },
  });

  useEffect(() => {
    if (token && email) {
      tokenMutation.mutate({ token, email });
    }
  }, [token, email]);

  const requestMutation = api.auth.emailVerification.request.useMutation();

  return (
    <div className="flex flex-col gap-6">
      <p
        data-status={tokenMutation.status}
        className="py-8 text-center text-black/70 data-[status=error]:text-danger"
      >
        {tokenMutation.error?.message}
      </p>
      <Button.Link
        color="primary"
        href={routes.auth.login}
        loading={tokenMutation.isLoading}
      >
        Login
      </Button.Link>

      <Button
        color="black"
        variant="bordered"
        loading={requestMutation.isLoading || tokenMutation.isLoading}
        onClick={() => {
          requestMutation.mutate({ email });
        }}
        disabled={!email || tokenMutation.isSuccess || didReRequest}
      >
        {email ? "Request new verification email" : "Email not found"}
      </Button>
    </div>
  );
}
