import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string(),
});
