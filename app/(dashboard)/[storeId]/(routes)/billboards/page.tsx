import prismadb from "@/lib/prismadb";
import { BillBoardClient } from "./_components/client";
import { BillboardColumn } from "@/components/columns/billboards-columns";

import { format } from "date-fns";

const BillBoardPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  if (!params.storeId) {
    null;
  }

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "Do-MMM-yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillBoardPage;
