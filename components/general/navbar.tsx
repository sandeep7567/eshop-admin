import { MainNav } from "@/components/general/main-nav";

import { StoreSwitcher } from "@/components/general/store-switcher";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { UserNavButton } from "./user-nav-button";

export const Navbar = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const { isAuth, userId, userInfo } = await useAuth();

  if (!isAuth) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  const property = await prismadb.property.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" property={property} />
        <div className="ml-auto flex items-center space-x-4">
          {/* <UserButton afterSignOutUrl="/" /> */}
          <UserNavButton stores={stores} userInfo={userInfo}/>
        </div>
      </div>
    </div>
  );
};
