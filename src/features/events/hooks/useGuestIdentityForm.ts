import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "@/stores/userStore";
import {
  guestIdentitySchema,
  type GuestIdentityFormValues,
} from "@/features/events/utils/guestIdentitySchema";

export function useGuestIdentityForm() {
  const storedUser = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const form = useForm<GuestIdentityFormValues>({
    resolver: zodResolver(guestIdentitySchema),
    values: {
      name: storedUser?.name ?? "",
      email: storedUser?.email ?? "",
    },
    mode: "all",
  });

  return {
    ...form,
    storedUser,
    setUser,
    clearUser,
  };
}
