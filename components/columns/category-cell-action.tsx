"use client";

import { FC, useState } from "react";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { onCopy } from "@/hooks/use-copy";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "../modals/alert-models";

import axios from "axios";

import { CategoriesColumn } from "@/components/columns/categories-columns";

interface CellActionProps {
  data: CategoriesColumn;
}

export const CategoriesCellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params: { storeId: string } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopyId = (id: string) => {
    const { success } = onCopy(id);
    if (success) {
      toast.success("api route copied to the clipboard");
      setIsCopy(true);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      router.refresh();
      toast.success("Category deleted!");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this category first!"
      );
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onCopyId(data?.id)}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params?.storeId}/categories/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Update</span>
          </DropdownMenuItem>
          {/* delete code from here */}
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
          {/* to here */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
