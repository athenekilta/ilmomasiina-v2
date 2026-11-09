import { useManagementUser } from "../hooks/useManagementUser";
import { ManagementPasswordForm } from "./ManagementPasswordForm";
import { NameForm } from "./NameForm";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { api } from "@/utils/api";
import { FieldSet } from "@/components/FieldSet";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { accountMessages } from "@/i18n/messages/account";
import { settingsMessages } from "@/i18n/messages/settings";

export function UserSettingsForm() {
  const user = useManagementUser();
  const alert = useAlert();
  const messages = useTranslations(accountMessages);
  const settings = useTranslations(settingsMessages);
  const locale = useLocale();
  const updateInformationMutation = api.profile.update.useMutation();
  const requestPasswordChangeMutation =
    api.auth.passwordChange.request.useMutation();
  return (
    <div className="surface-panel mt-2 p-4 sm:p-5">
      <FieldSet title={messages.settings.name}>
        {user.data && (
          <NameForm
            key={user.data.id}
            name={user.data.name || ""}
            unavailable={!!user.error}
            onSave={async (name) => {
              await updateInformationMutation.mutateAsync({ name });
            }}
            onReload={async () => {
              const result = await user.refetch();
              if (result.error || !result.data)
                throw new Error(messages.settings.loadFailed);
              return result.data.name || "";
            }}
          />
        )}
      </FieldSet>
      <FieldSet title={messages.settings.email}>
        <Input readOnly disabled value={user?.data?.email ?? ""} />
      </FieldSet>
      <FieldSet title={messages.settings.passwordChange}>
        <ManagementPasswordForm />
        <p className="mb-3 text-sm text-stone-600">
          {settings.password.forgot}
        </p>
        <Button
          type="button"
          variant="bordered"
          loading={requestPasswordChangeMutation.isPending}
          disabled={!user.data?.email || !!user.error}
          onClick={async () => {
            if (!user?.data?.email) return;
            try {
              await requestPasswordChangeMutation.mutateAsync({
                email: user.data.email,
                locale,
              });
              alert.success(messages.settings.passwordChangeSent);
            } catch {
              alert.error(messages.settings.passwordChangeFailed);
            }
          }}
        >
          {messages.settings.requestPasswordChange}
        </Button>
      </FieldSet>
    </div>
  );
}
