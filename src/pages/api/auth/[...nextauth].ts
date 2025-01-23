import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../server/external/prisma";
import { comparePassword } from "@/server/features/password/password";

export const authOptions: NextAuthOptions = {
  pages: {
    error: "/auth/login",
  },
  adapter: PrismaAdapter(prisma),
  /**
   * Use JWTs that last for 365 days.
   */
  session: {
    // JWTs
    strategy: "jwt",
    // 365 days
    maxAge: 365 * 24 * 60 * 60,
  },
  /**
   * Use default JWT settings
   */
  jwt: {},
  /**
   * Callbacks to enhance JWT and Session functionality
   */
  callbacks: {
    // Add UID to JWT
    async jwt({ token, user }) {
      // When signing in, user is present on the request. We copy the ID
      // to the JWT at sign-in and it will be present on the token for the
      // full duration of the session.
      if (user) {
        token.uid = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      // Copy the user id from the token to the session
      if (session.user && token) {
        session.user.id = token.uid as string;
      }
      return session;
    },

    signIn: async () => {
      return true;
    },
  },
  /**
   * Configure all authentication methods as NextAuth providers
   */
  providers: [
    /**
     * Credentials provide
     */
    CredentialsProvider({
      // Email and password credentials
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Provide an email to log in.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email.toLowerCase() },
        });

        if (!user) {
          throw new Error(`User ${credentials.email} not found.`);
        }

        if (!user.password) {
          throw new Error(
            "This user does not have a password. Try logging in another way."
          );
        }

        const passwordMatch = await comparePassword(
          credentials.password,
          user.password! // eslint-disable-line @typescript-eslint/no-non-null-assertion
        );

        if (!passwordMatch) {
          throw new Error("Wrong password");
        }

        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);
