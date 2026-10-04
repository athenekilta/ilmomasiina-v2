import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGuestIdentitySchema,
  type GuestIdentityFormValues,
} from "@/features/events/utils/guestIdentitySchema";
import { api } from "@/utils/api";
import { useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";
import { useMemo } from "react";

export function useGuestIdentityForm() {
  const messages = useTranslations(publicEventsMessages);
  const schema = useMemo(
    () => createGuestIdentitySchema(messages.validation.identity),
    [messages.validation.identity],
  );
  const apiContext = api.useContext();
  const identityQuery = api.userSession.getIdentity.useQuery(undefined, {
    staleTime: 0,
  });
  const updateIdentity = api.userSession.updateIdentity.useMutation({
    onSuccess: (identity) => {
      apiContext.userSession.getIdentity.setData(undefined, identity);
    },
  });
  const clearIdentity = api.userSession.clearIdentity.useMutation({
    onSuccess: () => {
      apiContext.userSession.getIdentity.setData(undefined, null);
    },
  });

  const form = useForm<GuestIdentityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
    mode: "all",
  });

  const { isDirty } = form.formState;
  const identity = identityQuery.data;
  useEffect(() => {
    if (identityQuery.isPending || isDirty) return;
    form.reset({
      name: identity?.name ?? "",
      email: identity?.email ?? "",
    });
  }, [form, identity, identityQuery.isPending, isDirty]);

  return {
    ...form,
    storedUser: identity,
    isIdentityLoading: identityQuery.isPending,
    setUser: (values: GuestIdentityFormValues) =>
      updateIdentity.mutateAsync(values),
    clearUser: () => clearIdentity.mutateAsync(),
  };
}
