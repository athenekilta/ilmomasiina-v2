import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/server/external/prisma";
import { passwordChangeHooks } from "./password-change-hooks";

export const managementAuth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: passwordChangeHooks(async (userId) => {
    const user = await prisma.managementUser.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true },
    });
    if (!user.email) throw new Error("Password change requires an email");
    await prisma.passwordChangeToken.deleteMany({
      where: { email: user.email },
    });
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
