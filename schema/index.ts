import * as z from "zod";

// 01 SettingsSchema and their types
export const SettingsSchema = z.object({
  name: z.string().min(1),
});

export type SettingsSchemaValues = z.infer<typeof SettingsSchema>;

// 01 PropertiesSchema and their types
export const PropertiesSchema = z.object({
  name: z.string().min(1),
});

export type PropertiesSchemaValues = z.infer<typeof PropertiesSchema>;

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

// 03 ProductSchema and their types
export const ProductsSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  images: z.object({ url: z.string() }).array().min(1, { message: "upload atleast one product" }),
  price: z.coerce.number().min(1, { message: "add atleast amount for this product"  }),
  categoryId: z.string().min(1, { message: "add category one categoryId using Categories route" }),
  colorId: z.string().min(1, { message: "add atleast one colorId using Colors route" }),
  sizeId: z.string().min(1, { message: "add atleast one sizeId using Colors route" }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),

});

export type ProductSchemaValues = z.infer<typeof ProductsSchema>;