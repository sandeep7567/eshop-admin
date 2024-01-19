import prismadb from "@/lib/prismadb";
import React from "react";
import { BillboardForm } from "@/components/forms/billboard-form";
import { isValidObjectId } from "@/lib/objectIdValidator";
import { redirect } from "next/navigation";

const BillboardsPage = async ({
  params,
}: {
  params: { storeId: string, billboardId: string };
}) => {

  const isObjectIDValid = isValidObjectId(params?.billboardId);

  if (!isObjectIDValid && params.billboardId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <BillboardForm />
        </div>
      </div>
    );
  };

  if (!isObjectIDValid) {
    redirect("/");
  };

  const billboard = await prismadb.billboard.findUnique({
    where: { id: params?.billboardId },
  });

  // if billboard is null then conver it true by --> !billboard === !null === true;
  if (!billboard) {
    redirect("/");
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardsPage;
