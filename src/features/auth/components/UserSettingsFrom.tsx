import { useUser } from "../hooks/useUser";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { api } from "@/utils/api";
import { FieldSet } from "@/components/FieldSet";
import { TextInputForm } from "@/components/TextInputForm";
import { userFormSchema } from "@/features/auth/utils/userFormSchema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export function UserSettingsForm() {
  const user = useUser();
  const alert = useAlert();
  const updateInformationMutation = api.profile.update.useMutation();
  const requestPasswordChangeMutation =
    api.auth.passwordChange.request.useMutation();
  return (
    <div className="mx-auto mt-5 max-w-4xl rounded-lg bg-white p-4 shadow-md">
      <FieldSet title={"Nimi / Name"}>
        <TextInputForm
          onSubmit={(name) => {
            updateInformationMutation.mutateAsync({ name });
          }}
          schema={userFormSchema.shape.name}
          defaultValue={user.data?.name || ""}
          value={user.data?.name || ""}
        />
      </FieldSet>
      <FieldSet title={"Email"}>
        <Input readOnly disabled value={user?.data?.email ?? ""} />
      </FieldSet>
      <FieldSet title={"Password change"}>
        <Button
          variant="bordered"
          onClick={async () => {
            if (!user?.data?.email) return;
            await requestPasswordChangeMutation.mutateAsync({
              email: user?.data?.email,
            });
            alert.success("Password change link sent to your email");
          }}
        >
          Request password change link
        </Button>
      </FieldSet>
    </div>
  );
}
