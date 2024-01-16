"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillBoardCellAction } from "@/components/columns/billboard-cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string
  label: string
  createdAt: string;
}

export const BillboardColumns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <BillBoardCellAction data={row.original}/>
      )
    }
  }
]
