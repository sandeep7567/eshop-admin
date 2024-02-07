import { auth } from "@/auth";
import { SettingsForm } from "@/components/forms/settings-form";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const session = await auth();
  const isAuth = session && session?.user?.id ? true : false;
  const userId = session?.user?.id;

  if (!isAuth) {
    redirect("/auth/login");
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
