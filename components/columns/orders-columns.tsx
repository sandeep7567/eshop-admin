"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SizeCellAction } from "./size-cell-action";
import { date } from "zod";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrdersColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  status?: "Pending" | "Delieverd" | "ONTHEWAY";
  products: string;
  createdAt: string;
};

export const OrdersColumns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
