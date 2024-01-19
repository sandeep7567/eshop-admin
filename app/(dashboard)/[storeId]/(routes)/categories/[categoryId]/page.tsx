import prismadb from "@/lib/prismadb";
import React from "react";

import { isValidObjectId } from "@/lib/objectIdValidator";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/forms/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string, storeId: string } }) => {
  const isObjectIDValid = isValidObjectId(params?.categoryId);

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId }
  });

  // New Create Component;
  if (!isObjectIDValid && params.categoryId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <CategoryForm
            billboards={billboards}
          />
        </div>
      </div>
    );
  };

  if (!isObjectIDValid) {
    redirect("/");
  };

  const category = await prismadb.category.findUnique({
    where: { id: params?.categoryId },
  });

  // if billboard is null then conver it true by --> !billboard === !null === true;
  if (!category) {
    redirect("/");
  };

  // Edit Component;
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <CategoryForm
          billboards={billboards}
          initialData={category}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
