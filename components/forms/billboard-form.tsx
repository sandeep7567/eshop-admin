"use client";

import { BillboardsSchema, BillboardsSchemaValues } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Billboard } from "@prisma/client";

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
import { ImageUpload } from "../ui/image-upload";

interface BillboardFormProps {
  initialData?: Billboard | null;
}

export const BillboardForm: FC<BillboardFormProps> = ({
  initialData,
}: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated!"
    : "Billboard Created!";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardsSchemaValues>({
    resolver: zodResolver(BillboardsSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: BillboardsSchemaValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params?.billboardId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      }
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted!");
    } catch (error) {
      toast.error(
        "Make sure you removed all categoris using this billboard first!"
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
          <FormField
              control={form.control}
              disabled={isLoading}
              name="imageUrl"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        disabled={isLoading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange("")}
                        values={field.value ? [field.value] : []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              disabled={isLoading}
              name="label"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Billboard label"
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
