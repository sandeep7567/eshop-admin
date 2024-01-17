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

// 03 SizesSchema and their types
export const SizesSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  value: z.string().min(1, { message: "value is required" }),
});

export type SizesSchemaValues = z.infer<typeof SizesSchema>;

// 03 ColorsSchema and their types
export const ColorsSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  value: z.string().min(4, { message: "value is required" }).regex(/^#/, { message: "String must be a valid hex code!" }),
});

export type ColorsSchemaValues = z.infer<typeof ColorsSchema>;