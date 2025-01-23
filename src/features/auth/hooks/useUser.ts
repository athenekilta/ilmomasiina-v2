import { api } from "@/utils/api";

/**
 * Access the current user
 */
export function useUser() {
  return api.profile.get.useQuery(undefined, {
    retry: 1,
  });
}
