import { api } from "@/utils/api";
import { useManagementSession } from "@/server/auth/management-auth-client";
import { useEffect } from "react";

export function UserInitializer() {
  const { data } = useManagementSession();

  const apiContext = api.useContext();
  const invalidateProfile = apiContext.profile.get.invalidate;
  useEffect(() => {
    invalidateProfile();
  }, [data]);

  return null;
}
