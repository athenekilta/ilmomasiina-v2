import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/server/external/prisma";

export const managementAuth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: { modelName: "ManagementUser" },
  session: { modelName: "ManagementSession" },
  account: { modelName: "ManagementAccount" },
  verification: { modelName: "ManagementVerification" },
  emailAndPassword: {
    enabled: true,
  },
});

export type ManagementSession = typeof managementAuth.$Infer.Session;
