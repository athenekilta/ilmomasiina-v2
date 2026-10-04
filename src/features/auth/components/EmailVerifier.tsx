import { useManagementUser } from "../hooks/useManagementUser";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Button } from "@/components/Button";
import { routes } from "@/utils/routes";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export function EmailVerifier() {
  const messages = useTranslations(authMessages);
  const locale = useLocale();
  const user = useManagementUser();
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
        className="data-[status=error]:text-danger py-8 text-center text-black/70"
      >
        {tokenMutation.error
          ? messages.emailVerification.verificationFailed
          : null}
      </p>
      <Button.Link color="primary" href={routes.auth.login}>
        {messages.actions.login}
      </Button.Link>

      <Button
        color="black"
        variant="bordered"
        loading={requestMutation.isPending || tokenMutation.isPending}
        onClick={() => {
          requestMutation.mutate({ email, locale });
        }}
        disabled={!email || tokenMutation.isSuccess || didReRequest}
      >
        {email
          ? messages.actions.requestNewVerificationEmail
          : messages.emailVerification.emailNotFound}
      </Button>
      {requestMutation.error && (
        <p role="alert" className="text-danger">
          {messages.emailVerification.requestFailed}
        </p>
      )}
    </div>
  );
}
