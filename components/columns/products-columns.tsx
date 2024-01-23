"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductCellAction } from "@/components/columns/product-cell-action";
import Image from "next/image";

import { X, Check } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  image: string;
  name: string;
  price: string;
  category: string;
  color: string;
  size: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const ProductColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-full h-full flex items-center gap-2">
        <Image
          src={row.original.image}
          alt="image"
          width={400}
          height={400}
          quality={100}
          style={{aspectRatio: "1/1", objectFit: "fill", objectPosition: "center", backgroundRepeat: "no-repeat", width: "4rem", height: "4rem"}}
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (
      <div className="h-fit w-1/2 aspect-square flex justify-center items-center">
        {row?.original?.isArchived ? (<Check size={16}  style={{color: "green"}} />) : (<X size={16} style={{color: "red"}}/>)}
      </div>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="h-fit w-1/2 aspect-square flex justify-center items-center">
        {row?.original?.isFeatured ? (<Check size={16}  style={{color: "green"}} />) : (<X size={16} style={{color: "red"}}/>)}
      </div>
    )
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* {row.original.color} */}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ProductCellAction data={row.original} />;
    },
  },
];
