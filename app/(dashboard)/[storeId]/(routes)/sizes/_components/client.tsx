"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { SizesColumn, SizesColumns } from "@/components/columns/sizes-columns";

interface SizeClientProps {
  data: SizesColumn[];
};

export const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data?.length})`}
          description="Manage sizes for your store"
        />
        <Button
          // In this route url new === dyanamic route id example -- we can pass params.storeId / params.billboardId
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={SizesColumns}
        data={data}
        searchKey="name"
      />
      <Separator/>
      <Heading
          title={"Api"}
          description="Api call for sizes"
      />
      <Separator/>
      <ApiList
        entityName={"sizes"}
        entityIdName={"sizeId"}
      />
    </>
  );
};
