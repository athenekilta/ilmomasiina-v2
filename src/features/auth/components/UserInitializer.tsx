import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function UserInitializer() {
  const { data, status } = useSession();

  const apiContext = api.useContext();
  const invalidateProfile = apiContext.profile.get.invalidate;
  useEffect(() => {
    invalidateProfile();
  }, [data, status]);

  return null;
}
