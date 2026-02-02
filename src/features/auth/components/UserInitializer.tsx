import { api } from "@/utils/api";
import { useSession } from "@/server/auth/auth-client";
import { useEffect } from "react";

export function UserInitializer() {
  const { data } = useSession();

  const apiContext = api.useContext();
  const invalidateProfile = apiContext.profile.get.invalidate;
  useEffect(() => {
    invalidateProfile();
  }, [data]);

  return null;
}
