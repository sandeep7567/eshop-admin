import prismadb from "@/lib/prismadb";
import React from "react";
import { PrismaClient, Prisma } from "@prisma/client";
import { BillboardForm } from "@/components/forms/billboard-form";
import { isValidObjectId } from "@/lib/objectIdValidator";
import { redirect } from "next/navigation";
import { SizeForm } from "@/components/forms/size-form";

const SizePage = async ({
  params,
}: {
  params: { storeId: string, sizeId: string };
}) => {

  const isObjectIDValid = isValidObjectId(params?.sizeId);

  if (!isObjectIDValid && params.sizeId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <SizeForm />
        </div>
      </div>
    );
  };

  const size = await prismadb.size.findUnique({
    where: { id: params?.sizeId },
  });

  // if billboard is null then conver it true by --> !billboard === !null === true;
  if (!size) {
    redirect("/");
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
