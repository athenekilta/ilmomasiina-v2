import { api } from "@/utils/api";

/**
 * Access the current user
 */
export function useManagementUser() {
  return api.profile.get.useQuery(undefined, {
    retry: 1,
  });
}
