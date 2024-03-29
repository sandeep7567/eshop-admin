import prismadb from "@/lib/prismadb";

import { ProductClient } from "./_components/client";
import { ProductColumn } from "@/components/columns/products-columns";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const ProductPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  if (!params.storeId) {
    null;
  }

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
      images: true,
    },
    orderBy: {
      // createdAt: "desc",
      updatedAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    image: item.images[0].url,
    createdAt: format(item.createdAt, "Do MMM yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
