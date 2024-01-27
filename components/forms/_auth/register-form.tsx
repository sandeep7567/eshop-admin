import { FC, FormEventHandler, useState, useTransition } from "react";
import * as z from "zod";
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
import { RegisterSchema, RegisterSchemaValues } from "@/schema";
import { toast } from "sonner";

interface RegisterFormProps {}

export const RegisterForm: FC<RegisterFormProps> = () => {
  const NEXT_PUBLIC_API_AUTH_URL = process.env.NEXT_PUBLIC_API_AUTH_URL;

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: RegisterSchemaValues) => {
    startTransition(async () => {
      try {
        const res = await axios.post(
          `${NEXT_PUBLIC_API_AUTH_URL}/register`,
          values
        );
        if (res?.data) {
          form.reset();
          toast.success("User registration success!");
        }
      } catch (error) {
        toast.error("something went wrong!")
      }
    });
  };

  const form = useForm<RegisterSchemaValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      type="text"
                      placeholder="user-name"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="user-email"
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
                      placeholder="******"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex justify-end items-center">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
