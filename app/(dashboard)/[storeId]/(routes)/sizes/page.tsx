import prismadb from "@/lib/prismadb";

import { SizeClient } from "./_components/client";
import { SizesColumn } from "@/components/columns/sizes-columns";

import { format } from "date-fns";

const SizePage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  if (!params.storeId) {
    null;
  }

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "Do-MMM-yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizePage;
