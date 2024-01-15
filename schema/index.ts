import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.string().min(1),
});

export type SettingsSchemaValues = z.infer<typeof SettingsSchema>;

export const BillboardsSchema = z.object({
  label: z.string().min(1, { message: "label is required" }),
  imageUrl: z.string().min(1, { message: "imageurl is required" }),
});

export type BillboardsSchemaValues = z.infer<typeof BillboardsSchema>;