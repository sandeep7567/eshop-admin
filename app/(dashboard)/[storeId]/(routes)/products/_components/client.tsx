"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  ProductColumn,
  ProductColumns
} from "@/components/columns/products-columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
};

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data?.length})`}
          description="Manage products for your store"
        />
        <Button
          // In this route url new === dyanamic route id example -- we can pass params.storeId / params.productId
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={ProductColumns}
        data={data}
        searchKey="name"
      />
      <Separator/>
      <Heading
          title={"Api"}
          description="Api call for Products"
      />
      <Separator/>
      <ApiList
        entityName={"products"}
        entityIdName={"productId"}
      />
    </>
  );
};
