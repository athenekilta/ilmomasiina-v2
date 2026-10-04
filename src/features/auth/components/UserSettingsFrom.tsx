import { useManagementUser } from "../hooks/useManagementUser";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { api } from "@/utils/api";
import { FieldSet } from "@/components/FieldSet";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerDraft } from "@/features/events/hooks/useServerDraft";
import { userFormSchema } from "@/features/auth/utils/userFormSchema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { accountMessages } from "@/i18n/messages/account";

const nameSchema = z.object({ name: userFormSchema.shape.name });

function NameForm({
  name,
  unavailable,
  onSave,
  onReload,
}: {
  name: string;
  unavailable: boolean;
  onSave: (name: string) => Promise<void>;
  onReload: () => Promise<string>;
}) {
  const alert = useAlert();
  const messages = useTranslations(accountMessages);
  const [reloading, setReloading] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { name },
  });
  const onAdopt = useCallback((name: string) => reset({ name }), [reset]);
  const draft = useServerDraft({
    incoming: unavailable ? undefined : name,
    dirty: isDirty || needsReload,
    busy: isSubmitting || reloading,
    onAdopt,
  });
  const reload = async () => {
    if (isSubmitting || reloading) return;
    setReloading(true);
    try {
      draft.adopt(await onReload());
      setNeedsReload(false);
    } catch {
      alert.error(messages.settings.loadFailed);
    } finally {
      setReloading(false);
    }
  };
  const submit = handleSubmit(async ({ name }) => {
    if (draft.changedElsewhere || needsReload || unavailable || reloading)
      return;
    try {
      await onSave(name);
    } catch {
      alert.error(messages.settings.saveFailed);
      return;
    }
    try {
      draft.adopt(await onReload());
    } catch {
      setNeedsReload(true);
      alert.warning(messages.settings.savedButReloadFailed);
    }
  });
  return (
    <form onSubmit={submit} className="space-y-3">
      {(draft.changedElsewhere || needsReload || unavailable) && (
        <div role="status" className="space-y-2 text-sm">
          <p>{messages.settings.staleName}</p>
          <Button
            type="button"
            disabled={isSubmitting || reloading}
            onClick={() => void reload()}
          >
            {messages.settings.discardAndReload}
          </Button>
        </div>
      )}
      <Input
        {...register("name")}
        disabled={isSubmitting || reloading}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={
          !isDirty ||
          draft.changedElsewhere ||
          needsReload ||
          unavailable ||
          reloading
        }
      >
        {messages.settings.saveName}
      </Button>
    </form>
  );
}

export function UserSettingsForm() {
  const user = useManagementUser();
  const alert = useAlert();
  const messages = useTranslations(accountMessages);
  const locale = useLocale();
  const updateInformationMutation = api.profile.update.useMutation();
  const requestPasswordChangeMutation =
    api.auth.passwordChange.request.useMutation();
  return (
    <div className="surface-panel mx-auto mt-2 max-w-3xl p-4 sm:p-5">
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
        <Button
          variant="bordered"
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
