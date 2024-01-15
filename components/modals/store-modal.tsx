"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

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
import { useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "E-shop name required",
  }),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    startTransition(async () => {
      try {
        const res = await axios.post(`/api/stores`, values);
        console.log(res);
        if (res?.data && res?.data) {
          window?.location?.assign(`/${res?.data.id}`);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
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
                        disabled={isPending}
                        {...field}
                        type="text"
                        placeholder="E-commerce"
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
                  onClick={storeModal.onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending}>
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
