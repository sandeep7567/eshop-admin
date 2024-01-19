"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import {
  OrdersColumn,
  OrdersColumns,
} from "@/components/columns/orders-columns";

interface OrderClientProps {
  data: OrdersColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data?.length})`}
          description="Manage orders for your store"
        />
      </div>
      <Separator />
      <DataTable columns={OrdersColumns} data={data} searchKey="products" />
    </>
  );
};
