"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { categorySchema, productSchema, subcategorySchema } from "@beads-bonita/core";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import {
  type ProductFlashErrorKind,
  type ProductFlashSuccessKind,
  PRODUCTS_FLASH_COOKIE_PATH,
  getProductFlashErrorCookieName,
  getProductFlashSuccessCookieName,
} from "./flash-state";

const PRODUCT_IMAGES_BUCKET = "product-images";
const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

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

function asRequiredNumber(value: FormDataEntryValue | null) {
  if (value === null || value === "") {
    return Number.NaN;
  }

  return Number(value);
}

async function setErrorCookie(kind: ProductFlashErrorKind, message: string) {
  const cookieStore = await cookies();
  const name = getProductFlashErrorCookieName(kind);

  cookieStore.set(name, message, {
    httpOnly: true,
    path: PRODUCTS_FLASH_COOKIE_PATH,
    sameSite: "lax",
  });
}

async function clearErrorCookie(kind: ProductFlashErrorKind) {
  const cookieStore = await cookies();
  const name = getProductFlashErrorCookieName(kind);

  cookieStore.delete(name);
}

async function setSuccessCookie(kind: ProductFlashSuccessKind) {
  const cookieStore = await cookies();
  const name = getProductFlashSuccessCookieName(kind);

  cookieStore.set(name, Date.now().toString(), {
    httpOnly: true,
    path: PRODUCTS_FLASH_COOKIE_PATH,
    sameSite: "lax",
  });
}

async function redirectWithError(kind: ProductFlashErrorKind, message: string): Promise<never> {
  await setErrorCookie(kind, message);
  redirect("/products");
}

function redirectWithQueryError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function isUniqueConstraintError(error: { code?: string; message: string }) {
  return error.code === "23505" || error.message.toLowerCase().includes("duplicate key value");
}

function sanitizeFileNameSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureProductImagesBucket() {
  const supabase = getSupabaseAdminClient() as any;
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    throw new Error(`Could not inspect storage buckets: ${bucketsError.message}`);
  }

  const bucketExists = (buckets ?? []).some(
    (bucket: { name?: string; id?: string }) =>
      bucket.name === PRODUCT_IMAGES_BUCKET || bucket.id === PRODUCT_IMAGES_BUCKET,
  );

  if (bucketExists) {
    return;
  }

  const { error: createBucketError } = await supabase.storage.createBucket(
    PRODUCT_IMAGES_BUCKET,
    {
      public: true,
      fileSizeLimit: `${MAX_PRODUCT_IMAGE_BYTES}`,
      allowedMimeTypes: [...ALLOWED_PRODUCT_IMAGE_TYPES],
    },
  );

  if (createBucketError) {
    throw new Error(
      `The "${PRODUCT_IMAGES_BUCKET}" bucket is missing and could not be created automatically: ${createBucketError.message}`,
    );
  }
}

async function uploadProductImages(input: {
  productId: string;
  productName: string;
  files: FormDataEntryValue[];
}) {
  // Generated DB types in this repo do not currently include product_images.
  // Cast locally so the storage pipeline can be implemented without blocking on typegen.
  const supabase = getSupabaseAdminClient() as any;
  const imageFiles = input.files.filter((file): file is File => {
    if (!file || typeof file === "string") {
      return false;
    }

    return (
      typeof file.name === "string" &&
      typeof file.type === "string" &&
      typeof file.size === "number" &&
      typeof file.arrayBuffer === "function" &&
      file.size > 0
    );
  });

  if (!imageFiles.length) {
    return;
  }

  await ensureProductImagesBucket();

  for (const file of imageFiles) {
    if (!ALLOWED_PRODUCT_IMAGE_TYPES.has(file.type)) {
      throw new Error(`${file.name} must be a JPG, PNG, WebP, or AVIF image.`);
    }

    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      throw new Error(`${file.name} exceeds the 5 MB upload limit.`);
    }
  }

  const { data: existingImages, error: existingImagesError } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", input.productId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (existingImagesError) {
    throw new Error(existingImagesError.message);
  }

  let nextSortOrder = (existingImages?.[0]?.sort_order ?? -1) + 1;

  for (const file of imageFiles) {
    const fileExtension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase() ?? "jpg"
      : "jpg";
    const baseName =
      sanitizeFileNameSegment(input.productName) ||
      sanitizeFileNameSegment(file.name.replace(/\.[^.]+$/, "")) ||
      "product-image";
    const storagePath = `${input.productId}/${Date.now()}-${nextSortOrder}-${baseName}.${fileExtension}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(storagePath, fileBuffer, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      if (uploadError.message.toLowerCase().includes("bucket not found")) {
        throw new Error(
          `The "${PRODUCT_IMAGES_BUCKET}" storage bucket is not available. Confirm your service-role key is valid and retry.`,
        );
      }

      throw new Error(uploadError.message);
    }

    const { error: imageInsertError } = await supabase.from("product_images").insert({
      product_id: input.productId,
      storage_path: storagePath,
      alt_text: input.productName,
      sort_order: nextSortOrder,
    });

    if (imageInsertError) {
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);
      throw new Error(imageInsertError.message);
    }

    nextSortOrder += 1;
  }
}

async function ensureScopedProductSubcategory(
  categoryId: string,
  subcategoryId: string | null,
) {
  if (!subcategoryId) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const { data: matchingSubcategory, error } = await supabase
    .from("subcategories")
    .select("id")
    .eq("id", subcategoryId)
    .eq("category_id", categoryId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!matchingSubcategory) {
    throw new Error("Selected subcategory does not belong to the chosen category.");
  }
}

async function ensureUniqueProductIdentity(input: {
  productId?: string;
  name: string;
  slug: string;
  sku?: string;
  onConflictPath?: string;
}) {
  const supabase = getSupabaseAdminClient();
  const productNameQuery = supabase
    .from("products")
    .select("id, name")
    .is("deleted_at", null)
    .eq("name", input.name)
    .limit(1);
  const slugQuery = supabase
    .from("products")
    .select("id, slug")
    .is("deleted_at", null)
    .eq("slug", input.slug)
    .limit(1);
  const skuQuery = input.sku
    ? supabase
        .from("products")
        .select("id, sku")
        .is("deleted_at", null)
        .eq("sku", input.sku)
        .limit(1)
    : Promise.resolve({ data: [], error: null });

  const [
    { data: matchingNameRows, error: matchingNameError },
    { data: matchingSlugRows, error: matchingSlugError },
    skuResult,
  ] = await Promise.all([productNameQuery, slugQuery, skuQuery]);

  if (matchingNameError) {
    throw new Error(matchingNameError.message);
  }

  if (matchingSlugError) {
    throw new Error(matchingSlugError.message);
  }

  if (skuResult.error) {
    throw new Error(skuResult.error.message);
  }

  const onConflict = (message: string): Promise<never> | never =>
    input.onConflictPath
      ? redirectWithQueryError(input.onConflictPath, message)
      : redirectWithError("product", message);

  const matchingName = matchingNameRows?.find((row) => row.id !== input.productId);
  if (matchingName) {
    return onConflict(`Product name "${input.name}" already exists.`);
  }

  const matchingSlug = matchingSlugRows?.find((row) => row.id !== input.productId);
  if (matchingSlug) {
    return onConflict(`Product slug "${input.slug}" already exists.`);
  }

  const matchingSku = skuResult.data?.find((row) => row.id !== input.productId);
  if (matchingSku) {
    return onConflict(`SKU "${input.sku}" already exists.`);
  }
}

async function ensureProductCanBePublished(input: {
  categoryId: string;
  subcategoryId: string;
  status: string;
  productId?: string;
}) {
  if (input.status !== "published") {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const [{ data: category, error: categoryError }, { data: subcategory, error: subcategoryError }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, is_active")
        .eq("id", input.categoryId)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("subcategories")
        .select("id, name, is_active")
        .eq("id", input.subcategoryId)
        .is("deleted_at", null)
        .maybeSingle(),
    ]);

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (subcategoryError) {
    throw new Error(subcategoryError.message);
  }

  if (!category || !subcategory) {
    return;
  }

  if (!category.is_active) {
    const message = `The category- ${category.name} is archived.`;
    if (input.productId) {
      redirectWithQueryError(`/products/${input.productId}`, message);
    }
    await redirectWithError("product", message);
  }

  if (!subcategory.is_active) {
    const message = `The subcategory- ${subcategory.name} is archived.`;
    if (input.productId) {
      redirectWithQueryError(`/products/${input.productId}`, message);
    }
    await redirectWithError("product", message);
  }
}

export async function createCategoryAction(formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    sortOrder: asRequiredNumber(formData.get("sortOrder")),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    await redirectWithError(
      "category",
      parsed.error.issues[0]?.message ?? "Invalid category input.",
    );
  }

  const data = parsed.data!;

  const supabase = getSupabaseAdminClient();
  const { data: existingCategories, error: existingCategoryError } = await supabase
    .from("categories")
    .select("name")
    .is("deleted_at", null)
    .eq("sort_order", data.sortOrder)
    .limit(1);

  if (existingCategoryError) {
    throw new Error(existingCategoryError.message);
  }

  const existingCategory = existingCategories?.[0];

  if (existingCategory) {
    await redirectWithError(
      "category",
      `Order number ${data.sortOrder} exists: ${existingCategory.name}`,
    );
  }

  const { data: existingSlugCategories, error: existingSlugCategoryError } = await supabase
    .from("categories")
    .select("name")
    .is("deleted_at", null)
    .eq("slug", data.slug)
    .limit(1);

  if (existingSlugCategoryError) {
    throw new Error(existingSlugCategoryError.message);
  }

  const existingSlugCategory = existingSlugCategories?.[0];

  if (existingSlugCategory) {
    await redirectWithError(
      "category",
      `Slug "${data.slug}" exists: ${existingSlugCategory.name}`,
    );
  }

  // Clean up any legacy soft-deleted row that still holds the unique slug.
  const { error: legacyDeletedCategoryError } = await supabase
    .from("categories")
    .delete()
    .eq("slug", data.slug)
    .not("deleted_at", "is", null);

  if (legacyDeletedCategoryError) {
    throw new Error(legacyDeletedCategoryError.message);
  }

  const { error } = await supabase.from("categories").insert({
    name: data.name,
    slug: data.slug,
    sort_order: data.sortOrder,
    is_active: data.isActive,
  });

  if (error) {
    if (isUniqueConstraintError(error)) {
      await redirectWithError("category", `Slug "${data.slug}" already exists.`);
    }

    throw new Error(error.message);
  }

  await clearErrorCookie("category");
  await setSuccessCookie("category");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function deleteCategoryAction(categoryId: string) {
  const supabase = getSupabaseAdminClient();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", categoryId)
    .is("deleted_at", null)
    .maybeSingle();

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (!category) {
    await redirectWithError("structure", "Category not found.");
  }

  const categoryData = category!;

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", categoryData.id)
    .is("deleted_at", null);

  if (productsError) {
    throw new Error(productsError.message);
  }

  const productIds = products?.map((product) => product.id) ?? [];

  if (productIds.length > 0) {
    const [{ error: testimonialsDeleteError }, { error: orderItemsDeleteError }] =
      await Promise.all([
        supabase.from("testimonials").delete().in("product_id", productIds),
        supabase.from("order_items").delete().in("product_id", productIds),
      ]);

    if (testimonialsDeleteError) {
      throw new Error(testimonialsDeleteError.message);
    }

    if (orderItemsDeleteError) {
      throw new Error(orderItemsDeleteError.message);
    }
  }

  const { error: productsDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("category_id", categoryData.id);

  if (productsDeleteError) {
    throw new Error(productsDeleteError.message);
  }

  const { error: subcategoriesDeleteError } = await supabase
    .from("subcategories")
    .delete()
    .eq("category_id", categoryData.id);

  if (subcategoriesDeleteError) {
    throw new Error(subcategoriesDeleteError.message);
  }

  const { error: categoryDeleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryData.id);

  if (categoryDeleteError) {
    throw new Error(categoryDeleteError.message);
  }

  await clearErrorCookie("structure");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function toggleCategoryStatusAction(categoryId: string, nextIsActive: boolean) {
  const supabase = getSupabaseAdminClient();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", categoryId)
    .is("deleted_at", null)
    .maybeSingle();

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (!category) {
    await redirectWithError("structure", "Category not found.");
  }

  const { error: categoryUpdateError } = await supabase
    .from("categories")
    .update({ is_active: nextIsActive })
    .eq("id", categoryId);

  if (categoryUpdateError) {
    throw new Error(categoryUpdateError.message);
  }

  if (!nextIsActive) {
    const { error: subcategoryUpdateError } = await supabase
      .from("subcategories")
      .update({ is_active: false })
      .eq("category_id", categoryId)
      .is("deleted_at", null);

    if (subcategoryUpdateError) {
      throw new Error(subcategoryUpdateError.message);
    }

    const { error: productUpdateError } = await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("category_id", categoryId)
      .is("deleted_at", null);

    if (productUpdateError) {
      throw new Error(productUpdateError.message);
    }
  } else {
    const { error: subcategoryUpdateError } = await supabase
      .from("subcategories")
      .update({ is_active: true })
      .eq("category_id", categoryId)
      .is("deleted_at", null);

    if (subcategoryUpdateError) {
      throw new Error(subcategoryUpdateError.message);
    }

    const { error: productUpdateError } = await supabase
      .from("products")
      .update({ status: "published" })
      .eq("category_id", categoryId)
      .is("deleted_at", null);

    if (productUpdateError) {
      throw new Error(productUpdateError.message);
    }
  }

  await clearErrorCookie("structure");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function createProductAction(formData: FormData) {
  const uploadedImages = formData.getAll("images");
  const parsed = productSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    subcategoryId: String(formData.get("subcategoryId") ?? "").trim(),
    story: asOptionalString(formData.get("story")),
    sustainabilityInfo: asOptionalString(formData.get("sustainabilityInfo")),
    careInstructions: asOptionalString(formData.get("careInstructions")),
    sku: String(formData.get("sku") ?? "").trim(),
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
    stockQuantity: asRequiredNumber(formData.get("stockQuantity")),
    lowStockThreshold: asRequiredNumber(formData.get("lowStockThreshold")),
  });

  if (!parsed.success) {
    await redirectWithError(
      "product",
      parsed.error.issues[0]?.message ?? "Invalid product input.",
    );
  }

  const data = parsed.data!;

  await ensureScopedProductSubcategory(
    data.categoryId,
    data.subcategoryId,
  );
  await ensureProductCanBePublished({
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    status: data.status,
  });
  await ensureUniqueProductIdentity({
    name: data.name,
    slug: data.slug,
    sku: data.sku,
  });

  const supabase = getSupabaseAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      category_id: data.categoryId,
      subcategory_id: data.subcategoryId,
      name: data.name,
      slug: data.slug,
      short_description: data.shortDescription,
      description: data.description,
      story: data.story ?? null,
      sustainability_info: data.sustainabilityInfo ?? null,
      care_instructions: data.careInstructions ?? null,
      sku: data.sku,
      price: data.price,
      compare_at_price: data.compareAtPrice ?? null,
      status: data.status,
      product_type: data.productType,
      lead_time_days: data.leadTimeDays ?? null,
      is_featured: data.isFeatured,
      is_best_seller: data.isBestSeller,
      is_limited_edition: data.isLimitedEdition,
    })
    .select("id")
    .single();

  if (productError || !product) {
    if (productError && isUniqueConstraintError(productError)) {
      await redirectWithError("product", "This product name, slug, or SKU already exists.");
    }

    throw new Error(productError?.message ?? "Failed to create product.");
  }

  const { error: stockError } = await supabase.from("inventory_stock").insert({
    product_id: product.id,
    quantity: data.stockQuantity,
    low_stock_threshold: data.lowStockThreshold,
  });

  if (stockError) {
    throw new Error(stockError.message);
  }

  await uploadProductImages({
    productId: product.id,
    productName: data.name,
    files: uploadedImages,
  });

  await clearErrorCookie("product");
  await setSuccessCookie("product");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function createSubcategoryAction(formData: FormData) {
  const parsed = subcategorySchema.safeParse({
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    sortOrder: asRequiredNumber(formData.get("sortOrder")),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    await redirectWithError(
      "subcategory",
      parsed.error.issues[0]?.message ?? "Invalid subcategory input.",
    );
  }

  const data = parsed.data!;

  const supabase = getSupabaseAdminClient();
  const [
    { data: existingSubcategories, error: existingSubcategoryError },
    { data: existingNamedSubcategories, error: existingNamedSubcategoryError },
    { data: conflictingCategoryByName, error: conflictingCategoryByNameError },
    { data: conflictingCategoryBySlug, error: conflictingCategoryBySlugError },
  ] = await Promise.all([
    supabase
      .from("subcategories")
      .select("name")
      .is("deleted_at", null)
      .eq("category_id", data.categoryId)
      .eq("sort_order", data.sortOrder)
      .limit(1),
    supabase
      .from("subcategories")
      .select("name, slug")
      .is("deleted_at", null)
      .eq("category_id", data.categoryId)
      .or(`name.eq.${data.name},slug.eq.${data.slug}`)
      .limit(10),
    supabase
      .from("categories")
      .select("name")
      .is("deleted_at", null)
      .eq("name", data.name)
      .limit(1),
    supabase
      .from("categories")
      .select("name")
      .is("deleted_at", null)
      .eq("slug", data.slug)
      .limit(1),
  ]);

  if (existingSubcategoryError) {
    throw new Error(existingSubcategoryError.message);
  }

  if (existingNamedSubcategoryError) {
    throw new Error(existingNamedSubcategoryError.message);
  }

  if (conflictingCategoryByNameError) {
    throw new Error(conflictingCategoryByNameError.message);
  }

  if (conflictingCategoryBySlugError) {
    throw new Error(conflictingCategoryBySlugError.message);
  }

  const existingSubcategory = existingSubcategories?.[0];

  if (existingSubcategory) {
    await redirectWithError(
      "subcategory",
      `Order number ${data.sortOrder} exists in this category: ${existingSubcategory.name}`,
    );
  }

  if (conflictingCategoryByName?.[0]) {
    await redirectWithError(
      "subcategory",
      `Subcategory name "${data.name}" cannot match category ${conflictingCategoryByName[0].name}.`,
    );
  }

  if (conflictingCategoryBySlug?.[0]) {
    await redirectWithError(
      "subcategory",
      `Subcategory slug "${data.slug}" cannot match category ${conflictingCategoryBySlug[0].name}.`,
    );
  }

  const existingSubcategoryWithSameName = existingNamedSubcategories?.find(
    (subcategory) => subcategory.name === data.name,
  );
  const existingSubcategoryWithSameSlug = existingNamedSubcategories?.find(
    (subcategory) => subcategory.slug === data.slug,
  );

  if (existingSubcategoryWithSameName) {
    await redirectWithError(
      "subcategory",
      `Subcategory name "${data.name}" already exists under this category.`,
    );
  }

  if (existingSubcategoryWithSameSlug) {
    await redirectWithError(
      "subcategory",
      `Subcategory slug "${data.slug}" already exists under this category.`,
    );
  }

  const { error: legacyDeletedSubcategoryError } = await supabase
    .from("subcategories")
    .delete()
    .eq("category_id", data.categoryId)
    .eq("slug", data.slug)
    .not("deleted_at", "is", null);

  if (legacyDeletedSubcategoryError) {
    throw new Error(legacyDeletedSubcategoryError.message);
  }

  const { error } = await supabase.from("subcategories").insert({
    category_id: data.categoryId,
    name: data.name,
    slug: data.slug,
    sort_order: data.sortOrder,
    is_active: data.isActive,
  });

  if (error) {
    if (isUniqueConstraintError(error)) {
      await redirectWithError(
        "subcategory",
        `Subcategory name or slug already exists under this category.`,
      );
    }

    throw new Error(error.message);
  }

  await clearErrorCookie("subcategory");
  await setSuccessCookie("subcategory");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function deleteSubcategoryAction(subcategoryId: string) {
  const supabase = getSupabaseAdminClient();

  const { data: subcategory, error: subcategoryError } = await supabase
    .from("subcategories")
    .select("id, name")
    .eq("id", subcategoryId)
    .is("deleted_at", null)
    .maybeSingle();

  if (subcategoryError) {
    throw new Error(subcategoryError.message);
  }

  if (!subcategory) {
    await redirectWithError("structure", "Subcategory not found.");
  }

  const subcategoryData = subcategory!;

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id")
    .eq("subcategory_id", subcategoryData.id)
    .is("deleted_at", null);

  if (productsError) {
    throw new Error(productsError.message);
  }

  const productIds = products?.map((product) => product.id) ?? [];

  if (productIds.length > 0) {
    const [{ error: testimonialsDeleteError }, { error: orderItemsDeleteError }] =
      await Promise.all([
        supabase.from("testimonials").delete().in("product_id", productIds),
        supabase.from("order_items").delete().in("product_id", productIds),
      ]);

    if (testimonialsDeleteError) {
      throw new Error(testimonialsDeleteError.message);
    }

    if (orderItemsDeleteError) {
      throw new Error(orderItemsDeleteError.message);
    }
  }

  const { error: productsDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("subcategory_id", subcategoryData.id);

  if (productsDeleteError) {
    throw new Error(productsDeleteError.message);
  }

  const { error: subcategoryDeleteError } = await supabase
    .from("subcategories")
    .delete()
    .eq("id", subcategoryData.id);

  if (subcategoryDeleteError) {
    throw new Error(subcategoryDeleteError.message);
  }

  await clearErrorCookie("structure");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function toggleSubcategoryStatusAction(
  subcategoryId: string,
  nextIsActive: boolean,
) {
  const supabase = getSupabaseAdminClient();

  const { data: subcategory, error: subcategoryError } = await supabase
    .from("subcategories")
    .select("id, name, category_id")
    .eq("id", subcategoryId)
    .is("deleted_at", null)
    .maybeSingle();

  if (subcategoryError) {
    throw new Error(subcategoryError.message);
  }

  if (!subcategory) {
    await redirectWithError("structure", "Subcategory not found.");
  }

  const subcategoryData = subcategory!;

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("name, is_active")
    .eq("id", subcategoryData.category_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (nextIsActive && category && !category.is_active) {
    await redirectWithError(
      "structure",
      `The category- ${category.name} is archived.`,
    );
  }

  const { error: subcategoryUpdateError } = await supabase
    .from("subcategories")
    .update({ is_active: nextIsActive })
    .eq("id", subcategoryId);

  if (subcategoryUpdateError) {
    throw new Error(subcategoryUpdateError.message);
  }

  if (!nextIsActive) {
    const { error: productUpdateError } = await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("subcategory_id", subcategoryId)
      .is("deleted_at", null);

    if (productUpdateError) {
      throw new Error(productUpdateError.message);
    }
  } else {
    const { error: productUpdateError } = await supabase
      .from("products")
      .update({ status: "published" })
      .eq("subcategory_id", subcategoryId)
      .is("deleted_at", null);

    if (productUpdateError) {
      throw new Error(productUpdateError.message);
    }
  }

  await clearErrorCookie("structure");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function updateProductAction(productId: string, formData: FormData) {
  const uploadedImages = formData.getAll("images");
  const parsed = productSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "").trim(),
    subcategoryId: String(formData.get("subcategoryId") ?? "").trim(),
    story: asOptionalString(formData.get("story")),
    sustainabilityInfo: asOptionalString(formData.get("sustainabilityInfo")),
    careInstructions: asOptionalString(formData.get("careInstructions")),
    sku: String(formData.get("sku") ?? "").trim(),
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
    stockQuantity: asRequiredNumber(formData.get("stockQuantity")),
    lowStockThreshold: asRequiredNumber(formData.get("lowStockThreshold")),
  });

  if (!parsed.success) {
    redirectWithQueryError(
      `/products/${productId}`,
      parsed.error.issues[0]?.message ?? "Invalid product input.",
    );
  }

  const data = parsed.data!;

  await ensureScopedProductSubcategory(
    data.categoryId,
    data.subcategoryId,
  );
  await ensureProductCanBePublished({
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    status: data.status,
    productId,
  });
  await ensureUniqueProductIdentity({
    productId,
    name: data.name,
    slug: data.slug,
    sku: data.sku,
    onConflictPath: `/products/${productId}`,
  });

  const supabase = getSupabaseAdminClient();
  const { error: productError } = await supabase
    .from("products")
    .update({
      category_id: data.categoryId,
      subcategory_id: data.subcategoryId,
      name: data.name,
      slug: data.slug,
      short_description: data.shortDescription,
      description: data.description,
      story: data.story ?? null,
      sustainability_info: data.sustainabilityInfo ?? null,
      care_instructions: data.careInstructions ?? null,
      sku: data.sku,
      price: data.price,
      compare_at_price: data.compareAtPrice ?? null,
      status: data.status,
      product_type: data.productType,
      lead_time_days: data.leadTimeDays ?? null,
      is_featured: data.isFeatured,
      is_best_seller: data.isBestSeller,
      is_limited_edition: data.isLimitedEdition,
    })
    .eq("id", productId);

  if (productError) {
    if (isUniqueConstraintError(productError)) {
      redirectWithQueryError(
        `/products/${productId}`,
        "This product name, slug, or SKU already exists.",
      );
    }

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
        quantity: data.stockQuantity,
        low_stock_threshold: data.lowStockThreshold,
      })
      .eq("id", inventoryRow.id);

    if (inventoryUpdateError) {
      throw new Error(inventoryUpdateError.message);
    }
  }

  await uploadProductImages({
    productId,
    productName: data.name,
    files: uploadedImages,
  });

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/product/${data.slug}`);
  redirect("/products");
}

export async function deleteProductAction(productId: string) {
  const supabase = getSupabaseAdminClient() as any;

  const [{ data: product, error: productError }, { data: productImages, error: productImagesError }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id, name, slug")
        .eq("id", productId)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("product_images")
        .select("storage_path")
        .eq("product_id", productId),
    ]);

  if (productError) {
    throw new Error(productError.message);
  }

  if (productImagesError) {
    throw new Error(productImagesError.message);
  }

  if (!product) {
    return redirectWithError("product", "Product not found.");
  }

  const productData = product;

  if (productImages?.length) {
    const { error: storageDeleteError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove(productImages.map((image: { storage_path: string }) => image.storage_path));

    if (storageDeleteError) {
      throw new Error(storageDeleteError.message);
    }
  }

  const [{ error: testimonialsDeleteError }, { error: orderItemsDeleteError }] =
    await Promise.all([
      supabase.from("testimonials").delete().eq("product_id", productId),
      supabase.from("order_items").delete().eq("product_id", productId),
    ]);

  if (testimonialsDeleteError) {
    throw new Error(testimonialsDeleteError.message);
  }

  if (orderItemsDeleteError) {
    throw new Error(orderItemsDeleteError.message);
  }

  const { error: productDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError) {
    throw new Error(productDeleteError.message);
  }

  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/product/${productData.slug}`);
  redirect("/products");
}

export async function deleteProductImageAction(
  productId: string,
  imageId: string,
  _formData: FormData,
) {
  const supabase = getSupabaseAdminClient() as any;

  const { data: image, error: imageError } = await supabase
    .from("product_images")
    .select("id, storage_path")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();

  if (imageError) {
    throw new Error(imageError.message);
  }

  if (!image) {
    return redirectWithQueryError(`/products/${productId}`, "Product image not found.");
  }

  const { error: storageDeleteError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([image.storage_path]);

  if (storageDeleteError) {
    throw new Error(storageDeleteError.message);
  }

  const { error: imageDeleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (imageDeleteError) {
    throw new Error(imageDeleteError.message);
  }

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
  revalidatePath("/shop");
  redirect(`/products/${productId}`);
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
  revalidatePath("/");
  revalidatePath("/shop");
}
