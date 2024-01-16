"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  CategoriesColumn,
  CategoriesColumns,
} from "@/components/columns/categories-columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoriesColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    // Category Client List Show
    <>
      {/* 01 -Header */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data?.length})`}
          description="Manage categories for your store"
        />
        <Button
          // In this route url new === dyanamic route id example -- we can pass params.storeId / params.billboardId
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      {/* 02 Table component */}
      <DataTable searchKey="name" columns={CategoriesColumns} data={data} />
      <Separator />
      {/* 03 Api call links */}
      <Heading title={"Api"} description="Api call for Categories" />
      <Separator />
      <ApiList entityName={"categories"} entityIdName={"categoryId"} />
    </>
  );
};
