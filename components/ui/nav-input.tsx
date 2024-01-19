"use client";

import { FC, useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropertiesSchemaValues, PropertiesSchema } from '@/schema';
import { Button } from './button';
import { Input } from './input';
import { Delete, MoveRight, MoveRightIcon, RemoveFormattingIcon } from 'lucide-react';

interface NavInput {
  isOpen: boolean;
  initialData: { name: string };
}

export const NavInput: FC<NavInput> = ({
  initialData,
  isOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PropertiesSchemaValues>({
    resolver: zodResolver(PropertiesSchema),
    defaultValues: initialData || {
      name: ""
    },
  });

  const onSubmit = (values:PropertiesSchemaValues) => {
    console.log(values);
  }

  if (!isOpen) {
    return null;
  };

  return (
    <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex gap-x-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='w-[75%]'
                        disabled={isLoading}
                        placeholder="Property name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          <Button disabled={isLoading} variant={"default"} size={'sm'} className="w-fit" type="submit">
            Create
          </Button>
          </div>
        </form>
      </Form>
  )
};