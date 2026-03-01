import Link from "next/link";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import {
  createCategoryAction,
  createProductAction,
  createSubcategoryAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { profile } = await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const [{ data: categories }, { data: subcategories }, { data: products }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, sort_order, is_active")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("subcategories")
        .select("id, category_id, name, slug, sort_order, is_active")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(
          "id, name, slug, status, price, category_id, subcategory_id, created_at",
        )
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const { data: inventoryRows } = await supabase
    .from("inventory_stock")
    .select("id, product_id, quantity, low_stock_threshold")
    .not("product_id", "is", null);

  const categoryMap = new Map(categories?.map((category) => [category.id, category.name]) ?? []);
  const subcategoryMap = new Map(
    subcategories?.map((subcategory) => [subcategory.id, subcategory.name]) ?? [],
  );
  const inventoryMap = new Map(
    inventoryRows?.map((row) => [row.product_id ?? "", row]) ?? [],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 md:px-8">
      <div className="space-y-8">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-rose)]">
            Catalog control
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-ivory)]">
            Categories, subcategories, and products
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            This admin slice now supports the real catalog structure you
            described: categories, dynamic subcategories, richer products, and
            inventory-linked records.
          </p>
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/10 p-4 text-sm text-white/70">
            Signed in as {profile.full_name ?? "Admin"}.
          </div>
        </Surface>

        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-6">
            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-ivory)]">
                Create category
              </h2>
              <form action={createCategoryAction} className="mt-6 space-y-4">
                <label className="block space-y-2 text-sm">
                  <span>Name</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="name" required type="text" />
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Slug</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="slug" required type="text" />
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Sort order</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={0} name="sortOrder" type="number" />
                </label>
                <label className="flex items-center gap-3 text-sm text-white/80">
                  <input defaultChecked name="isActive" type="checkbox" />
                  Active category
                </label>
                <button className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]" type="submit">
                  Add category
                </button>
              </form>
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-ivory)]">
                Create subcategory
              </h2>
              <form action={createSubcategoryAction} className="mt-6 space-y-4">
                <label className="block space-y-2 text-sm">
                  <span>Parent category</span>
                  <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="categoryId" required>
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Name</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="name" required type="text" />
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Slug</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="slug" required type="text" />
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Sort order</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={0} name="sortOrder" type="number" />
                </label>
                <label className="flex items-center gap-3 text-sm text-white/80">
                  <input defaultChecked name="isActive" type="checkbox" />
                  Active subcategory
                </label>
                <button className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]" type="submit">
                  Add subcategory
                </button>
              </form>

              <div className="mt-8 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                  Existing subcategories
                </p>
                {subcategories?.length ? (
                  subcategories.map((subcategory) => (
                    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm" key={subcategory.id}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{subcategory.name}</p>
                          <p className="mt-1 text-white/55">
                            {categoryMap.get(subcategory.category_id) ?? "Unknown category"}
                          </p>
                        </div>
                        <span className="text-white/55">{subcategory.slug}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/60">No subcategories created yet.</p>
                )}
              </div>
            </Surface>
          </div>

          <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-ivory)]">
              Create product
            </h2>
            <form action={createProductAction} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm md:col-span-2">
                <span>Name</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="name" required type="text" />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Slug</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="slug" required type="text" />
              </label>
              <label className="block space-y-2 text-sm">
                <span>SKU</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="sku" type="text" />
              </label>
              <label className="block space-y-2 text-sm md:col-span-2">
                <span>Short description</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="shortDescription" required type="text" />
              </label>
              <label className="block space-y-2 text-sm md:col-span-2">
                <span>Description</span>
                <textarea className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="description" required />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Category</span>
                <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="categoryId" required>
                  <option value="">Select category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2 text-sm">
                <span>Subcategory</span>
                <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue="" name="subcategoryId">
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
                <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue="draft" name="status">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label className="block space-y-2 text-sm">
                <span>Product type</span>
                <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue="ready_stock" name="productType">
                  <option value="ready_stock">Ready stock</option>
                  <option value="made_to_order">Made to order</option>
                  <option value="custom_request_enabled">Custom request enabled</option>
                </select>
              </label>
              <label className="block space-y-2 text-sm">
                <span>Price</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" min="0" name="price" required step="0.01" type="number" />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Compare at price</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" min="0" name="compareAtPrice" step="0.01" type="number" />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Lead time (days)</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" min="0" name="leadTimeDays" type="number" />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Stock quantity</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={0} min="0" name="stockQuantity" type="number" />
              </label>
              <label className="block space-y-2 text-sm">
                <span>Low stock threshold</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" defaultValue={3} min="0" name="lowStockThreshold" type="number" />
              </label>
              <label className="block space-y-2 text-sm md:col-span-2">
                <span>Story</span>
                <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="story" />
              </label>
              <label className="block space-y-2 text-sm md:col-span-2">
                <span>Sustainability info</span>
                <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="sustainabilityInfo" />
              </label>
              <label className="block space-y-2 text-sm md:col-span-2">
                <span>Care instructions</span>
                <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" name="careInstructions" />
              </label>
              <div className="flex flex-wrap gap-4 md:col-span-2">
                <label className="flex items-center gap-3 text-sm text-white/80">
                  <input name="isFeatured" type="checkbox" />
                  Featured
                </label>
                <label className="flex items-center gap-3 text-sm text-white/80">
                  <input name="isBestSeller" type="checkbox" />
                  Best seller
                </label>
                <label className="flex items-center gap-3 text-sm text-white/80">
                  <input name="isLimitedEdition" type="checkbox" />
                  Limited edition
                </label>
              </div>
              <div className="md:col-span-2">
                <button className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]" type="submit">
                  Create product
                </button>
              </div>
            </form>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                  Recent products
                </p>
                <Link className="text-sm font-semibold text-[var(--color-bonita-ivory)]" href="/inventory">
                  Inventory view
                </Link>
              </div>
              {products?.length ? (
                products.map((product) => {
                  const inventory = inventoryMap.get(product.id);
                  return (
                    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm" key={product.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="mt-1 text-white/55">{product.slug}</p>
                          <p className="mt-2 text-white/65">
                            {categoryMap.get(product.category_id) ?? "Unknown category"}
                            {product.subcategory_id
                              ? ` / ${subcategoryMap.get(product.subcategory_id) ?? "Unknown subcategory"}`
                              : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">BDT {product.price}</p>
                          <p className="mt-1 capitalize text-white/55">{product.status}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 text-white/65">
                        <p>
                          Stock: {inventory?.quantity ?? 0}
                          {inventory && inventory.quantity <= inventory.low_stock_threshold
                            ? " (Low)"
                            : ""}
                        </p>
                        <Link
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-ivory)]"
                          href={`/products/${product.id}`}
                        >
                          Edit product
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-white/60">No products created yet.</p>
              )}
            </div>
          </Surface>
        </div>
      </div>
    </main>
  );
}
