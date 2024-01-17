"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SizeCellAction } from "@/components/columns/size-cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizesColumn = {
  id: string
  name: string
  value: string
  createdAt: string;
};

export const SizesColumns: ColumnDef<SizesColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <SizeCellAction data={row.original}/>
      )
    }
  }
]
