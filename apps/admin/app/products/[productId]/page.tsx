import Link from "next/link";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import { updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  await requireAdmin();
  const { productId } = await params;
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
          <Link className="mt-6 inline-block text-sm font-semibold text-[var(--color-bonita-ivory)]" href="/products">
            Back to products
          </Link>
        </Surface>
      </main>
    );
  }

  const updateAction = updateProductAction.bind(null, productId);

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
            <Link className="text-sm font-semibold text-[var(--color-bonita-ivory)]" href="/products">
              Back to products
            </Link>
          </div>
        </Surface>

        <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
          <form action={updateAction} className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm md:col-span-2">
              <span>Name</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.name} name="name" required type="text" />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Slug</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.slug} name="slug" required type="text" />
            </label>
            <label className="block space-y-2 text-sm">
              <span>SKU</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.sku ?? ""} name="sku" type="text" />
            </label>
            <label className="block space-y-2 text-sm md:col-span-2">
              <span>Short description</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.short_description} name="shortDescription" required type="text" />
            </label>
            <label className="block space-y-2 text-sm md:col-span-2">
              <span>Description</span>
              <textarea className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.description} name="description" required />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Category</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.category_id} name="categoryId" required>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span>Subcategory</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.subcategory_id ?? ""} name="subcategoryId">
                <option value="">None</option>
                {subcategories?.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span>Status</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.status} name="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span>Product type</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.product_type} name="productType">
                <option value="ready_stock">Ready stock</option>
                <option value="made_to_order">Made to order</option>
                <option value="custom_request_enabled">Custom request enabled</option>
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span>Price</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.price} min="0" name="price" required step="0.01" type="number" />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Compare at price</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.compare_at_price ?? ""} min="0" name="compareAtPrice" step="0.01" type="number" />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Lead time (days)</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.lead_time_days ?? ""} min="0" name="leadTimeDays" type="number" />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Stock quantity</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={inventory?.quantity ?? 0} min="0" name="stockQuantity" type="number" />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Low stock threshold</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={inventory?.low_stock_threshold ?? 3} min="0" name="lowStockThreshold" type="number" />
            </label>
            <label className="block space-y-2 text-sm md:col-span-2">
              <span>Story</span>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.story ?? ""} name="story" />
            </label>
            <label className="block space-y-2 text-sm md:col-span-2">
              <span>Sustainability info</span>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.sustainability_info ?? ""} name="sustainabilityInfo" />
            </label>
            <label className="block space-y-2 text-sm md:col-span-2">
              <span>Care instructions</span>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={product.care_instructions ?? ""} name="careInstructions" />
            </label>
            <div className="flex flex-wrap gap-4 md:col-span-2">
              <label className="flex items-center gap-3 text-sm text-white/80">
                <input defaultChecked={product.is_featured} name="isFeatured" type="checkbox" />
                Featured
              </label>
              <label className="flex items-center gap-3 text-sm text-white/80">
                <input defaultChecked={product.is_best_seller} name="isBestSeller" type="checkbox" />
                Best seller
              </label>
              <label className="flex items-center gap-3 text-sm text-white/80">
                <input defaultChecked={product.is_limited_edition} name="isLimitedEdition" type="checkbox" />
                Limited edition
              </label>
            </div>
            <div className="md:col-span-2">
              <button className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]" type="submit">
                Save changes
              </button>
            </div>
          </form>
        </Surface>
      </div>
    </main>
  );
}
