import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        <SessionProvider session={user}>
          <ModalProvider />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
