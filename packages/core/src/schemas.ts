import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published", "archived"]);
export const productTypeSchema = z.enum([
  "ready_stock",
  "made_to_order",
  "custom_request_enabled",
]);

const slugSchema = z
  .string()
  .min(2)
  .max(140)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must use lowercase letters, numbers, and hyphens only.",
  );

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: slugSchema.max(100),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

export const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(80),
  slug: slugSchema.max(100),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugSchema,
  shortDescription: z.string().min(10).max(240),
  description: z.string().min(20),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid(),
  story: z.string().max(1500).optional(),
  sustainabilityInfo: z.string().max(1200).optional(),
  careInstructions: z.string().max(1200).optional(),
  sku: z.string().min(2).max(64),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  status: productStatusSchema,
  productType: productTypeSchema,
  leadTimeDays: z.number().int().min(0).nullable().optional(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isLimitedEdition: z.boolean().default(false),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0),
});

export const testimonialSchema = z.object({
  body: z.string().min(20).max(600),
  imagePath: z.string().min(1).optional(),
  productId: z.string().uuid().optional(),
});

export const checkoutIntentSchema = z.object({
  email: z.email(),
  phone: z.string().min(8).max(20),
  shippingAddressId: z.string().uuid(),
  paymentMethod: z.enum(["sslcommerz", "cash_on_delivery"]),
  note: z.string().max(300).optional(),
});
