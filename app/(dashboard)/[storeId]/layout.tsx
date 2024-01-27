import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Navbar } from "@/components/general/navbar";
import { isValidObjectId } from "@/lib/objectIdValidator";
import { ModalProvider } from "@/providers/modal-provider";
import { useAuth } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store Dashboard",
  description: "Store Dashboard",
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
  const { isAuth, userId, userInfo } = await useAuth();

  if (!isAuth) {
    redirect("/");
  }

  const isObjectIDValid = isValidObjectId(params?.storeId);

  if (!isObjectIDValid) {
    redirect("/");
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/error");
  };

  return (
    <>
      <div>
        <ModalProvider />
        <Navbar params={params} />
        {children}
      </div>
    </>
  );
}
