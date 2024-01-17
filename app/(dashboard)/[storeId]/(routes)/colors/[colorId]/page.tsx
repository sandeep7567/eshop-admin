import prismadb from "@/lib/prismadb";
import React from "react";

import { isValidObjectId } from "@/lib/objectIdValidator";
import { redirect } from "next/navigation";
import { SizeForm } from "@/components/forms/size-form";
import { ColorForm } from "@/components/forms/color-form";

const ColorPage = async ({
  params,
}: {
  params: { storeId: string, colorId: string };
}) => {

  const isObjectIDValid = isValidObjectId(params?.colorId);

  if (!isObjectIDValid && params.colorId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <ColorForm />
        </div>
      </div>
    );
  };

  const color = await prismadb.color.findUnique({
    where: { id: params?.colorId },
  });

  // if billboard is null then conver it true by --> !billboard === !null === true;
  if (!color) {
    redirect("/");
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
