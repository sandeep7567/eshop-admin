import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Create Store Dashboard",
  description: "Admin Create Store Dashboard",
};

export default async function SetupLayout({ children }: PropsWithChildren) {
  const {userId} = auth();

  if (!userId) {
    redirect("/sign-in");
  };

  const store = await prismadb.store.findFirst({
    where: {
      userId
    }
  });

  if (store) {
    redirect(`/${store?.id}`)
  };

  return (
    <>
     {children}
    </>
  );
}
