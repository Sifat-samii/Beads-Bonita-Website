"use server";

import { revalidatePath } from "next/cache";
import { categorySchema, productSchema, subcategorySchema } from "@beads-bonita/core";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  if (value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function asOptionalString(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue.length > 0 ? stringValue : undefined;
}

export async function createCategoryAction(formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    sortOrder: asNumber(formData.get("sortOrder")),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid category input.");
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/products");
}

export async function createProductAction(formData: FormData) {
  const parsed = productSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    subcategoryId: asOptionalString(formData.get("subcategoryId")) ?? null,
    story: asOptionalString(formData.get("story")),
    sustainabilityInfo: asOptionalString(formData.get("sustainabilityInfo")),
    careInstructions: asOptionalString(formData.get("careInstructions")),
    sku: asOptionalString(formData.get("sku")),
    price: asNumber(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice")
      ? asNumber(formData.get("compareAtPrice"))
      : null,
    status: String(formData.get("status") ?? "draft"),
    productType: String(formData.get("productType") ?? "ready_stock"),
    leadTimeDays: formData.get("leadTimeDays")
      ? asNumber(formData.get("leadTimeDays"))
      : null,
    isFeatured: formData.get("isFeatured") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isLimitedEdition: formData.get("isLimitedEdition") === "on",
    stockQuantity: asNumber(formData.get("stockQuantity")),
    lowStockThreshold: asNumber(formData.get("lowStockThreshold"), 3),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product input.");
  }

  const supabase = getSupabaseAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      category_id: parsed.data.categoryId,
      subcategory_id: parsed.data.subcategoryId ?? null,
      name: parsed.data.name,
      slug: parsed.data.slug,
      short_description: parsed.data.shortDescription,
      description: parsed.data.description,
      story: parsed.data.story ?? null,
      sustainability_info: parsed.data.sustainabilityInfo ?? null,
      care_instructions: parsed.data.careInstructions ?? null,
      sku: parsed.data.sku ?? null,
      price: parsed.data.price,
      compare_at_price: parsed.data.compareAtPrice ?? null,
      status: parsed.data.status,
      product_type: parsed.data.productType,
      lead_time_days: parsed.data.leadTimeDays ?? null,
      is_featured: parsed.data.isFeatured,
      is_best_seller: parsed.data.isBestSeller,
      is_limited_edition: parsed.data.isLimitedEdition,
    })
    .select("id")
    .single();

  if (productError || !product) {
    throw new Error(productError?.message ?? "Failed to create product.");
  }

  const { error: stockError } = await supabase.from("inventory_stock").insert({
    product_id: product.id,
    quantity: parsed.data.stockQuantity,
    low_stock_threshold: parsed.data.lowStockThreshold,
  });

  if (stockError) {
    throw new Error(stockError.message);
  }

  revalidatePath("/products");
}

export async function createSubcategoryAction(formData: FormData) {
  const parsed = subcategorySchema.safeParse({
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    sortOrder: asNumber(formData.get("sortOrder")),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid subcategory input.");
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("subcategories").insert({
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  const parsed = productSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    subcategoryId: asOptionalString(formData.get("subcategoryId")) ?? null,
    story: asOptionalString(formData.get("story")),
    sustainabilityInfo: asOptionalString(formData.get("sustainabilityInfo")),
    careInstructions: asOptionalString(formData.get("careInstructions")),
    sku: asOptionalString(formData.get("sku")),
    price: asNumber(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice")
      ? asNumber(formData.get("compareAtPrice"))
      : null,
    status: String(formData.get("status") ?? "draft"),
    productType: String(formData.get("productType") ?? "ready_stock"),
    leadTimeDays: formData.get("leadTimeDays")
      ? asNumber(formData.get("leadTimeDays"))
      : null,
    isFeatured: formData.get("isFeatured") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isLimitedEdition: formData.get("isLimitedEdition") === "on",
    stockQuantity: asNumber(formData.get("stockQuantity")),
    lowStockThreshold: asNumber(formData.get("lowStockThreshold"), 3),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product input.");
  }

  const supabase = getSupabaseAdminClient();
  const { error: productError } = await supabase
    .from("products")
    .update({
      category_id: parsed.data.categoryId,
      subcategory_id: parsed.data.subcategoryId ?? null,
      name: parsed.data.name,
      slug: parsed.data.slug,
      short_description: parsed.data.shortDescription,
      description: parsed.data.description,
      story: parsed.data.story ?? null,
      sustainability_info: parsed.data.sustainabilityInfo ?? null,
      care_instructions: parsed.data.careInstructions ?? null,
      sku: parsed.data.sku ?? null,
      price: parsed.data.price,
      compare_at_price: parsed.data.compareAtPrice ?? null,
      status: parsed.data.status,
      product_type: parsed.data.productType,
      lead_time_days: parsed.data.leadTimeDays ?? null,
      is_featured: parsed.data.isFeatured,
      is_best_seller: parsed.data.isBestSeller,
      is_limited_edition: parsed.data.isLimitedEdition,
    })
    .eq("id", productId);

  if (productError) {
    throw new Error(productError.message);
  }

  const { data: inventoryRow, error: inventoryFetchError } = await supabase
    .from("inventory_stock")
    .select("id")
    .eq("product_id", productId)
    .maybeSingle();

  if (inventoryFetchError) {
    throw new Error(inventoryFetchError.message);
  }

  if (inventoryRow) {
    const { error: inventoryUpdateError } = await supabase
      .from("inventory_stock")
      .update({
        quantity: parsed.data.stockQuantity,
        low_stock_threshold: parsed.data.lowStockThreshold,
      })
      .eq("id", inventoryRow.id);

    if (inventoryUpdateError) {
      throw new Error(inventoryUpdateError.message);
    }
  }

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
}

export async function adjustInventoryAction(formData: FormData) {
  const inventoryId = String(formData.get("inventoryId") ?? "").trim();
  const productId = String(formData.get("productId") ?? "").trim();
  const delta = asNumber(formData.get("delta"));
  const reason = String(formData.get("reason") ?? "").trim();
  const adminId = String(formData.get("adminId") ?? "").trim();

  if (!inventoryId || !productId || !reason || delta === 0) {
    throw new Error("Inventory adjustment requires target, non-zero delta, and reason.");
  }

  const supabase = getSupabaseAdminClient();
  const { data: currentInventory, error: inventoryFetchError } = await supabase
    .from("inventory_stock")
    .select("quantity")
    .eq("id", inventoryId)
    .single();

  if (inventoryFetchError || !currentInventory) {
    throw new Error(inventoryFetchError?.message ?? "Inventory row not found.");
  }

  const nextQuantity = currentInventory.quantity + delta;

  if (nextQuantity < 0) {
    throw new Error("Inventory cannot go below zero.");
  }

  const { error: inventoryUpdateError } = await supabase
    .from("inventory_stock")
    .update({ quantity: nextQuantity })
    .eq("id", inventoryId);

  if (inventoryUpdateError) {
    throw new Error(inventoryUpdateError.message);
  }

  const { error: adjustmentError } = await supabase.from("inventory_adjustments").insert({
    inventory_stock_id: inventoryId,
    admin_id: adminId,
    reason,
    delta,
  });

  if (adjustmentError) {
    throw new Error(adjustmentError.message);
  }

  revalidatePath("/inventory");
  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
}
