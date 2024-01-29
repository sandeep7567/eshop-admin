import { FC, useEffect, useState, useTransition } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaValues } from "@/schema";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import { UseAccountModal } from "@/hooks/use-account-modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useSession } from "next-auth/react";

interface LoginFormProps {}

export const LoginForm: FC<LoginFormProps> = () => {
  
  const NEXT_PUBLIC_API_AUTH_URL = process.env.NEXT_PUBLIC_API_AUTH_URL;
  const { data: session } = useSession();
  const router = useRouter();

  // Store Control
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  // Account Control
  const onOpenAccount = UseAccountModal((state) => state.onOpen);
  const onCloseAccount = UseAccountModal((state) => state.onClose);
  const isOpenAccount = UseAccountModal((state) => state.isOpen);


  useEffect(() => {

    if (session && !isOpen) {
      (async () => {
        try {
          const { data } = await axios.get(`/api/stores`);

          if (session && !data) {
            onOpen();
          }

          if (session && data) {
            router.refresh();
            router.push(`/${data?.id}`);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [onOpen, isOpen, session, onOpen, router]);

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: LoginSchemaValues) => {
    startTransition(async () => {
      try {
        const res = await axios.post(
          `${NEXT_PUBLIC_API_AUTH_URL}/login`,
          values
        );
        toast.success("login success!");
        if (res?.data?.success) {
          router.push("/");
          onCloseAccount();
          router.refresh();
        }
      } catch (error) {
        console.log(error);
        toast.error("something went wrong!");
      }
    });
  };

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div>
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      type="email"
                      placeholder="demo@demo.com"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      type="password"
                      placeholder="123456"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex justify-end items-center">
              <Button type="submit" disabled={isPending} className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
