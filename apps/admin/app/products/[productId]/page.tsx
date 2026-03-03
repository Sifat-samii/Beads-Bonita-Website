import Link from "next/link";
import { getPublicStorageUrl } from "@beads-bonita/supabase";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import { ProductForm } from "../product-form";
import {
  deleteProductAction,
  deleteProductImageAction,
  updateProductAction,
} from "../actions";

export const dynamic = "force-dynamic";

type ProductImageRow = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { productId } = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = getSupabaseAdminClient() as any;

  const [
    { data: product },
    { data: inventory },
    { data: categories },
    { data: subcategories },
    { data: productImages },
  ] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id, category_id, subcategory_id, name, slug, short_description, description, story, sustainability_info, care_instructions, sku, price, compare_at_price, product_type, status, lead_time_days, is_featured, is_best_seller, is_limited_edition",
        )
        .eq("id", productId)
        .single(),
      supabase
        .from("inventory_stock")
        .select("id, quantity, low_stock_threshold")
        .eq("product_id", productId)
        .maybeSingle(),
      supabase
        .from("categories")
        .select("id, name, is_active")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("subcategories")
        .select("id, category_id, name, is_active")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("product_images")
        .select("id, storage_path, alt_text, sort_order")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true }),
    ]);

  if (!product) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8 md:px-8">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-ivory)]">
            Product not found
          </h1>
          <Link
            className="mt-6 inline-block text-sm font-semibold text-[var(--color-bonita-ivory)]"
            href="/products"
          >
            Back to products
          </Link>
        </Surface>
      </main>
    );
  }

  const updateAction = updateProductAction.bind(null, productId);
  const deleteAction = deleteProductAction.bind(null, productId);
  const deleteImageAction = deleteProductImageAction.bind(null, productId);
  const categoryStateMap = new Map(
    categories?.map((category: { id: string; is_active: boolean }) => [
      category.id,
      category.is_active,
    ]) ?? [],
  );
  const selectedCategoryIsActive = categoryStateMap.get(product.category_id) ?? false;
  const selectedSubcategory = subcategories?.find(
    (subcategory: { id: string }) => subcategory.id === product.subcategory_id,
  );
  const productVisibilityMessage = !selectedCategoryIsActive
    ? "This product is hidden on the storefront because its category is archived."
    : selectedSubcategory && !selectedSubcategory.is_active
      ? "This product is hidden on the storefront because its subcategory is archived."
      : product.status === "archived"
        ? "This product is hidden on the storefront because the product itself is archived."
        : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8 md:px-8">
      <div className="space-y-6">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                Product editor
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-ivory)]">
                {product.name}
              </h1>
            </div>
            <Link
              className="text-sm font-semibold text-[var(--color-bonita-ivory)]"
              href="/products"
            >
              Back to products
            </Link>
          </div>
          {productVisibilityMessage ? (
            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {productVisibilityMessage}
            </div>
          ) : null}
        </Surface>

        <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
          <ProductForm
            action={updateAction}
            buttonLabel="Save changes"
            cancelHref="/products"
            categories={
              categories?.map(
                (category: { id: string; name: string; is_active: boolean }) => ({
                  id: category.id,
                  name: category.name,
                  label: category.is_active
                    ? category.name
                    : `${category.name} (Archived)`,
                }),
              ) ?? []
            }
            defaultValues={{
              name: product.name,
              slug: product.slug,
              sku: product.sku ?? "",
              shortDescription: product.short_description,
              description: product.description,
              categoryId: product.category_id,
              subcategoryId: product.subcategory_id ?? "",
              status: product.status,
              productType: product.product_type,
              price: String(product.price),
              compareAtPrice:
                product.compare_at_price == null ? "" : String(product.compare_at_price),
              leadTimeDays:
                product.lead_time_days == null ? "" : String(product.lead_time_days),
              stockQuantity: String(inventory?.quantity ?? 0),
              lowStockThreshold: String(inventory?.low_stock_threshold ?? 3),
              story: product.story ?? "",
              sustainabilityInfo: product.sustainability_info ?? "",
              careInstructions: product.care_instructions ?? "",
              isFeatured: product.is_featured,
              isBestSeller: product.is_best_seller,
              isLimitedEdition: product.is_limited_edition,
            }}
            errorMessage={resolvedSearchParams?.error}
            deleteAction={deleteAction}
            deleteProductName={product.name}
            deleteImageAction={deleteImageAction}
            existingImages={
              productImages?.map((image: ProductImageRow) => ({
                id: image.id,
                url: getPublicStorageUrl("product-images", image.storage_path),
                altText: image.alt_text,
              })) ?? []
            }
            productId={productId}
            storageKey={`bb-admin-product-edit-form-${productId}`}
            subcategories={
              subcategories?.map(
                (subcategory: {
                  id: string;
                  category_id: string;
                  name: string;
                  is_active: boolean;
                }) => ({
                  id: subcategory.id,
                  categoryId: subcategory.category_id,
                  name: subcategory.name,
                  label: `${
                    subcategory.name
                  }${
                    !(categoryStateMap.get(subcategory.category_id) ?? false)
                      ? " (Hidden by archived category)"
                      : !subcategory.is_active
                        ? " (Archived)"
                        : ""
                  }`,
                }),
              ) ?? []
            }
          />
        </Surface>
      </div>
    </main>
  );
}
