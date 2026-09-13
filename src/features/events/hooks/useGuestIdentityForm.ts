import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  guestIdentitySchema,
  type GuestIdentityFormValues,
} from "@/features/events/utils/guestIdentitySchema";
import { api } from "@/utils/api";

export function useGuestIdentityForm() {
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
    resolver: zodResolver(guestIdentitySchema),
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
