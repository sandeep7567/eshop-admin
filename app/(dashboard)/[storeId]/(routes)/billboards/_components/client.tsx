"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  BillboardColumn,
  BillboardColumns,
} from "@/components/columns/billboards-columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BillBoardClientProps {
  data: BillboardColumn[];
};

export const BillBoardClient: React.FC<BillBoardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data?.length})`}
          description="Manage billboard for your store"
        />
        <Button
          // In this route url new === dyanamic route id example -- we can pass params.storeId / params.billboardId
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={BillboardColumns}
        data={data}
        searchKey="label"
      />
      <Separator/>
      <Heading
          title={"Api"}
          description="Api call for Billboards"
      />
      <Separator/>
      <ApiList
        entityName={"billboards"}
        entityIdName={"billboardId"}
      />
    </>
  );
};
