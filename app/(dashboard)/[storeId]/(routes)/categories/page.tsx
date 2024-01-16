import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./_components/client";

import { format } from "date-fns";
import { CategoriesColumn } from "@/components/columns/categories-columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  if (!params.storeId) {
    null;
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      billborad: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoriesColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billborad.label,
    createdAt: format(item.createdAt, "Do-MMM-yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
