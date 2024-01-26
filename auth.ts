import NextAuth from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const AUTH_SECRET = `${process.env.AUTH_SECRET}`

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // pages: {
  //   signIn: "/auth/login",
  //   error: "/auth/error",
  // },
  debug: process.env.NODE_ENV !== "production",
  // events: {
  //   async linkAccount({ user }) {
  //     await db.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() }
  //     })
  //   }
  // },
  callbacks: {
    async signIn({ user, account, credentials }) {
      console.log({credentials});

      console.log({user, account});
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);
      console.log({existingUser});

      // Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      //   if (!twoFactorConfirmation) return false;

      //   // Delete two factor confirmation for next sign in
      //   await db.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id }
      //   });
      // }

      if (existingUser?.id !== user?.id ) return false;

      return true;
    },
    async session({ token, session }) {
      console.log({session}, {token});
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

      console.log(session);

      return session;
    },
    async jwt({ token }) {
      console.log(token);
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      console.log(token);

      return token;
    }
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  secret: AUTH_SECRET,
  ...authConfig,
},);