import Link from "next/link";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import { ProductForm } from "../product-form";
import { deleteProductAction, updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

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
  const supabase = getSupabaseAdminClient();

  const [{ data: product }, { data: inventory }, { data: categories }, { data: subcategories }] =
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
        .select("id, name")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("subcategories")
        .select("id, category_id, name")
        .is("deleted_at", null)
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
        </Surface>

        <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
          <ProductForm
            action={updateAction}
            buttonLabel="Save changes"
            cancelHref="/products"
            categories={
              categories?.map((category) => ({
                id: category.id,
                name: category.name,
              })) ?? []
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
            productId={productId}
            storageKey={`bb-admin-product-edit-form-${productId}`}
            subcategories={
              subcategories?.map((subcategory) => ({
                id: subcategory.id,
                categoryId: subcategory.category_id,
                name: subcategory.name,
              })) ?? []
            }
          />
        </Surface>
      </div>
    </main>
  );
}
