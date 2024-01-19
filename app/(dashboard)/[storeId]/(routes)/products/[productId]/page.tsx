import prismadb from "@/lib/prismadb";
import React from "react";
import { ProductForm } from "@/components/forms/product-form";
import { isValidObjectId } from "@/lib/objectIdValidator";
import { redirect } from "next/navigation";

const ProductsPage = async ({
  params,
}: {
  params: { storeId: string; productId: string };
}) => {
  const isObjectIDValid = isValidObjectId(params?.productId);

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
  });
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
  });
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
  });

  if (!isObjectIDValid && params.productId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <ProductForm
            categories={categories}
            sizes={sizes}
            colors={colors}
          />
        </div>
      </div>
    );
  };

  if (!isObjectIDValid) {
    redirect("/");
  };

  const product = await prismadb.product.findUnique({
    where: { id: params?.productId },
    include: { images: true },
  });

  // if product is null then conver it true by --> !product === !null === true;
  if (!product) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
