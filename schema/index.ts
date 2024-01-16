import * as z from "zod";

// 01 SettingsSchema and their types
export const SettingsSchema = z.object({
  name: z.string().min(1),
});

export type SettingsSchemaValues = z.infer<typeof SettingsSchema>;

// 02 BillboardsSchema and their types
export const BillboardsSchema = z.object({
  label: z.string().min(1, { message: "label is required" }),
  imageUrl: z.string().min(1, { message: "imageurl is required" }),
});

export type BillboardsSchemaValues = z.infer<typeof BillboardsSchema>;

// 03 CategoriesSchema and their types
export const CategoriesSchema = z.object({
  name: z.string().min(1, { message: "label is required" }),
  billboardId: z.string().min(1, { message: "billboardId is required" }),
});

export type CategoriesSchemaValues = z.infer<typeof CategoriesSchema>;