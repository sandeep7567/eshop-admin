"use client"

import { ColumnDef } from "@tanstack/react-table";
import { CategoriesCellAction } from "@/components/columns/category-cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoriesColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string;
}

export const CategoriesColumns: ColumnDef<CategoriesColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoriesCellAction data={row.original}/>
  }
]
