import { querySchema } from "@/schemas/querySchema";
import { useRouter } from "next/router";

export function useQueryParams() {

  const router = useRouter();
  return {...querySchema.parse(router.query), isReady: router.isReady};
}
