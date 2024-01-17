"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { ColorsColumn, ColorsColumns } from "@/components/columns/colors-columns";

interface ColorClientProps {
  data: ColorsColumn[];
};

export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data?.length})`}
          description="Manage colors for your store"
        />
        <Button
          // In this route url new === dyanamic route id example -- we can pass params.storeId / params.billboardId
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={ColorsColumns}
        data={data}
        searchKey="name"
      />
      <Separator/>
      <Heading
          title={"Api"}
          description="Api call for colors"
      />
      <Separator/>
      <ApiList
        entityName={"colors"}
        entityIdName={"colorId"}
      />
    </>
  );
};
