import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { isGithubAuthConfigured, serverEnv } from "@/shared/config/env";
import { prisma } from "@/server/db/prisma";

const authSecret =
  serverEnv.AUTH_SECRET ??
  (process.env.NODE_ENV !== "production"
    ? "english-os-local-dev-secret"
    : undefined);

const providers = isGithubAuthConfigured
  ? [
      GitHub({
        clientId: serverEnv.AUTH_GITHUB_ID!,
        clientSecret: serverEnv.AUTH_GITHUB_SECRET!,
      }),
    ]
  : [];

const adapter = prisma ? PrismaAdapter(prisma) : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  trustHost: true,
  providers,
  secret: authSecret,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: adapter ? "database" : "jwt",
  },
});
