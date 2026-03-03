import { cache } from "react";
import { getPublicStorageUrl } from "@beads-bonita/supabase";
import { createSupabaseServerClient } from "@beads-bonita/supabase/server";

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type StoreSubcategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type StoreProductCard = {
  id: string;
  categoryId: string;
  subcategoryId: string | null;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  productType: "ready_stock" | "made_to_order" | "custom_request_enabled";
  leadTimeDays: number | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  createdAt: string;
  primaryImageUrl: string | null;
};

export type StoreProductDetail = {
  id: string;
  categoryId: string;
  subcategoryId: string | null;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  story: string | null;
  sustainabilityInfo: string | null;
  careInstructions: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  productType: "ready_stock" | "made_to_order" | "custom_request_enabled";
  leadTimeDays: number | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
};

export type ProductImage = {
  id: string;
  storagePath: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

type ProductImageRow = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
};

type ProductCardImageRow = {
  product_id: string;
  storage_path: string;
  sort_order: number;
};

export type CatalogSort = "newest" | "price-asc" | "price-desc" | "featured";

function toProductCard(row: {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  slug: string;
  short_description: string;
  price: number | string;
  compare_at_price: number | string | null;
  product_type: StoreProductCard["productType"];
  lead_time_days: number | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  created_at: string;
  primary_image_path?: string | null;
}): StoreProductCard {
  return {
    id: row.id,
    categoryId: row.category_id,
    subcategoryId: row.subcategory_id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? null : Number(row.compare_at_price),
    productType: row.product_type,
    leadTimeDays: row.lead_time_days,
    isFeatured: row.is_featured,
    isBestSeller: row.is_best_seller,
    isLimitedEdition: row.is_limited_edition,
    createdAt: row.created_at,
    primaryImageUrl: row.primary_image_path
      ? getPublicStorageUrl("product-images", row.primary_image_path)
      : null,
  };
}

export const getPublishedCategories = cache(async (): Promise<StoreCategory[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    sortOrder: category.sort_order,
  }));
});

export const getPublishedSubcategories = cache(async (): Promise<StoreSubcategory[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, name, slug, sort_order")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((subcategory) => ({
    id: subcategory.id,
    categoryId: subcategory.category_id,
    name: subcategory.name,
    slug: subcategory.slug,
    sortOrder: subcategory.sort_order,
  }));
});

export async function getPublishedProducts(input?: {
  categoryId?: string;
  subcategoryId?: string;
  sort?: CatalogSort;
  limit?: number;
}): Promise<StoreProductCard[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select(
      "id, category_id, subcategory_id, name, slug, short_description, price, compare_at_price, product_type, lead_time_days, is_featured, is_best_seller, is_limited_edition, created_at",
    )
    .is("deleted_at", null)
    .eq("status", "published");

  if (input?.categoryId) {
    query = query.eq("category_id", input.categoryId);
  }

  if (input?.subcategoryId) {
    query = query.eq("subcategory_id", input.subcategoryId);
  }

  if (input?.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (input?.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else if (input?.sort === "featured") {
    query = query.order("is_featured", { ascending: false }).order("created_at", {
      ascending: false,
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (input?.limit) {
    query = query.limit(input.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const products = (data ?? []).map(toProductCard);

  if (!products.length) {
    return products;
  }

  const { data: imageRows, error: imagesError } = (await supabase
    .from("product_images")
    .select("product_id, storage_path, sort_order")
    .in(
      "product_id",
      products.map((product) => product.id),
    )
    .order("sort_order", { ascending: true })) as {
    data: ProductCardImageRow[] | null;
    error: { message: string } | null;
  };

  if (imagesError) {
    throw new Error(imagesError.message);
  }

  const imageByProductId = new Map<string, string>();

  for (const image of imageRows ?? []) {
    if (!imageByProductId.has(image.product_id)) {
      imageByProductId.set(
        image.product_id,
        getPublicStorageUrl("product-images", image.storage_path),
      );
    }
  }

  return products.map((product) => ({
    ...product,
    primaryImageUrl: imageByProductId.get(product.id) ?? null,
  }));
}

export const getPublishedProductBySlug = cache(
  async (
    slug: string,
  ): Promise<{
    product: StoreProductDetail | null;
    images: ProductImage[];
  }> => {
    const supabase = await createSupabaseServerClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        "id, category_id, subcategory_id, name, slug, short_description, description, story, sustainability_info, care_instructions, sku, price, compare_at_price, product_type, lead_time_days, is_featured, is_best_seller, is_limited_edition",
      )
      .is("deleted_at", null)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (productError) {
      throw new Error(productError.message);
    }

    if (!product) {
      return { product: null, images: [] };
    }

    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("id, storage_path, alt_text, sort_order")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true });

    if (imagesError) {
      throw new Error(imagesError.message);
    }

    return {
      product: {
        id: product.id,
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id,
        name: product.name,
        slug: product.slug,
        shortDescription: product.short_description,
        description: product.description,
        story: product.story,
        sustainabilityInfo: product.sustainability_info,
        careInstructions: product.care_instructions,
        sku: product.sku,
        price: Number(product.price),
        compareAtPrice:
          product.compare_at_price == null ? null : Number(product.compare_at_price),
        productType: product.product_type,
        leadTimeDays: product.lead_time_days,
        isFeatured: product.is_featured,
        isBestSeller: product.is_best_seller,
        isLimitedEdition: product.is_limited_edition,
      },
      images: ((images ?? []) as ProductImageRow[]).map((image) => ({
        id: image.id,
        storagePath: image.storage_path,
        url: getPublicStorageUrl("product-images", image.storage_path),
        altText: image.alt_text,
        sortOrder: image.sort_order,
      })),
    };
  },
);

export async function getRelatedProducts(input: {
  productId: string;
  categoryId: string;
  limit?: number;
}) {
  const products = await getPublishedProducts({
    categoryId: input.categoryId,
    sort: "featured",
    limit: (input.limit ?? 4) + 1,
  });

  return products.filter((product) => product.id !== input.productId).slice(0, input.limit ?? 4);
}

export async function getCatalogContext() {
  const [categories, subcategories] = await Promise.all([
    getPublishedCategories(),
    getPublishedSubcategories(),
  ]);

  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const subcategoryBySlug = new Map(
    subcategories.map((subcategory) => [subcategory.slug, subcategory]),
  );
  const subcategoriesByCategory = new Map<string, StoreSubcategory[]>();

  for (const subcategory of subcategories) {
    const items = subcategoriesByCategory.get(subcategory.categoryId) ?? [];
    items.push(subcategory);
    subcategoriesByCategory.set(subcategory.categoryId, items);
  }

  for (const [categoryId, items] of subcategoriesByCategory) {
    subcategoriesByCategory.set(
      categoryId,
      [...items].sort((left, right) => left.sortOrder - right.sortOrder),
    );
  }

  return {
    categories,
    subcategories,
    categoryMap,
    categoryBySlug,
    subcategoryBySlug,
    subcategoriesByCategory,
  };
}
