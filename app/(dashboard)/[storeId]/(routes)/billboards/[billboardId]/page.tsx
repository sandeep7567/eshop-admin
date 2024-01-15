import prismadb from "@/lib/prismadb";
import React from "react";
import { PrismaClient, Prisma } from "@prisma/client";
import { BillboardForm } from "@/components/forms/billboard-form";

const billboardsPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  if (params.billboardId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <BillboardForm />
        </div>
      </div>
    );
  }

  const billboard = await prismadb.billboard.findUnique({
    where: { id: params?.billboardId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default billboardsPage;
