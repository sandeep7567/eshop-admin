import { MainNav } from "@/components/general/main-nav";

import { UserButton, auth } from "@clerk/nextjs";
import { StoreSwitcher } from "@/components/general/store-switcher";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export const Navbar = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
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

  console.log(property);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" property={property} />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
