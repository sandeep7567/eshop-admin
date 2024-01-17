import prismadb from "@/lib/prismadb";

import { ColorClient } from "./_components/client";

import { format } from "date-fns";
import { ColorsColumn } from "@/components/columns/colors-columns";

const ColorPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  if (!params.storeId) {
    null;
  }

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorsColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "Do-MMM-yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorPage;
