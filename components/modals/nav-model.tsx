"use client";

import React, { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { PropertiesSchema, PropertiesSchemaValues } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

interface NavModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavModal: React.FC<NavModalProps> = ({
  isOpen,
  onClose,
}: NavModalProps) => {
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toastMessage = "Property created!";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: PropertiesSchemaValues) => {
    try {
      setIsLoading(true);
      if (false) {
        // await axios.patch(
        //   `/api/${params.storeId}/colors/${params?.colorId}`,
        //   values
        // );
      } else {
        await axios.post(`/api/${params.storeId}/properties`, values);
      }
      router.refresh();
      onClose();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      form.setValue("name", "");
    }
  };

  const navData = [
    "Overview",
    "Billboards",
    "Categories",
    "Sizes",
    "Colors",
    "Products",
    "Orders",
    "Settings",
  ];

  const form = useForm<PropertiesSchemaValues>({
    resolver: zodResolver(PropertiesSchema),
    defaultValues: {
      name: "",
    },
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Create Property"
      description={`write below given api generated nav to get auto generated api routes`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="flex justify-center items-center flex-wrap gap-2">
            {navData.map((title, i) => (
              <div key={i} className="p-1.5 text-sm bg-muted-foreground text-muted rounded-md">
                {title}
              </div>
            ))}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        {...field}
                        type="text"
                        placeholder="Overview"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex justify-end items-center">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isLoading}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
