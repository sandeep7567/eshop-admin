import { MainNav } from "@/components/general/main-nav";

import { StoreSwitcher } from "@/components/general/store-switcher";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { UserNavButton } from "./user-nav-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/auth";

export const Navbar = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const session = await auth();
  const isAuth = session && session?.user?.id ? true : false;
  const userId = session?.user?.id;
  const userInfo = session?.user;

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
          <ThemeToggle />
          <UserNavButton stores={stores} userInfo={userInfo}/>
        </div>
      </div>
    </div>
  );
};
