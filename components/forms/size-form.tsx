"use client";

import { SizesSchema, SizesSchemaValues } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Size } from "@prisma/client";

import { FC, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-models";

interface SizeFormProps {
  initialData?: Size | null;
};

export const SizeForm: FC<SizeFormProps> = ({
  initialData,
}: SizeFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData
    ? "Size updated!"
    : "Size Created!";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizesSchemaValues>({
    resolver: zodResolver(SizesSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: SizesSchemaValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params?.sizeId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }
      router.push(`/${params.storeId}/sizes`)
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      toast.success("Sizes deleted!");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this size first!"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isLoading={isLoading}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => setIsOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              disabled={isLoading}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Size Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Size Value"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
