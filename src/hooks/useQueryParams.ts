import { querySchema } from "@/schemas/querySchema";
import { useRouter } from "next/router";

export function useQueryParams() {
  return querySchema.parse(useRouter().query);
}
