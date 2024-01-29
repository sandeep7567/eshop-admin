import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prismadb from "@/lib/prismadb";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";

export const AUTH_SECRET = `${process.env.AUTH_SECRET}` as string;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // events: {
  //   async linkAccount({ user }) {
  //     await prismadb.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() },
  //     });
  //   },
  // },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth without email verification
      if (account && account?.provider !== "credentials") {
        return true;
      } else if (account && account?.provider === ("github" || "google")) {
        await prisma?.user.upsert({
          where: {
            email: profile?.email as string,
          },
          update: {
            image: profile?.picture
          },
          create: {
            // id: user?.id && user?.id.toString(), // Convert GitHub user ID to a string
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
            accounts: {
              create: {
                provider: account?.provider,
                providerAccountId: account?.providerAccountId,
                access_token: account?.access_token,
                token_type: account?.token_type,
                scope: account?.scope,
                type: account?.type,
              },
            },
          },
        });

        return true
      };

      const existingUser = await getUserById(user.id!);

      const userAccountExisting = await prismadb.account.findFirst({
        where: {
          userId: existingUser?.id,
        },
      });

      if (!userAccountExisting) {
        const userAccount = await prismadb.account.create({
          data: {
            userId: existingUser?.id,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            type: account?.type,
          } as any,
        });

        if (!userAccount) return false;

        return true;
      }

      // Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      //   if (!twoFactorConfirmation) return false;

      // // Delete two factor confirmation for next sign in
      // await prismadb.twoFactorConfirmation.delete({
      //   where: { id: twoFactorConfirmation.id }
      // });
      // }

      if (!userAccountExisting) return false;

      if (existingUser?.id !== user?.id) return false;

      return true;
    },
    async session({ token, session }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      // if (session.user) {
      //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      // }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  ...authConfig,
});
