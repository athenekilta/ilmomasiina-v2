import { createAuthClient } from "better-auth/react";

const managementAuthClient = createAuthClient();

export const managementSignIn = managementAuthClient.signIn;
export const managementSignUp = managementAuthClient.signUp;
export const managementSignOut = managementAuthClient.signOut;
export const useManagementSession = managementAuthClient.useSession;
