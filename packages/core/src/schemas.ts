import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published", "archived"]);
export const productTypeSchema = z.enum([
  "ready_stock",
  "made_to_order",
  "custom_request_enabled",
]);

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140),
  shortDescription: z.string().min(10).max(240),
  description: z.string().min(20),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid().nullable().optional(),
  price: z.number().nonnegative(),
  status: productStatusSchema,
  productType: productTypeSchema,
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
