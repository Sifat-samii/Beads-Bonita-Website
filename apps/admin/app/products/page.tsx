import Link from "next/link";
import { cookies } from "next/headers";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import { CategoryCreateForm } from "./category-create-form";
import { CategoryStructureTree } from "./category-structure-tree";
import { ErrorMessage } from "./error-message";
import { PRODUCTS_FLASH_COOKIES } from "./flash-state";
import { ProductForm } from "./product-form";
import { SubcategoryCreateForm } from "./subcategory-create-form";
import {
  createCategoryAction,
  createProductAction,
  createSubcategoryAction,
  deleteCategoryAction,
  deleteSubcategoryAction,
  toggleCategoryStatusAction,
  toggleSubcategoryStatusAction,
} from "./actions";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    categoryError?: string;
    subcategoryError?: string;
    productError?: string;
    structureError?: string;
    categorySuccess?: string;
    subcategorySuccess?: string;
    productSuccess?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { profile } = await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const categoryError =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.categoryError)?.value ??
    resolvedSearchParams?.categoryError;
  const subcategoryError =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.subcategoryError)?.value ??
    resolvedSearchParams?.subcategoryError;
  const productError =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.productError)?.value ??
    resolvedSearchParams?.productError;
  const structureError =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.structureError)?.value ??
    resolvedSearchParams?.structureError;
  const categorySuccess =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.categorySuccess)?.value ??
    resolvedSearchParams?.categorySuccess;
  const subcategorySuccess =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.subcategorySuccess)?.value ??
    resolvedSearchParams?.subcategorySuccess;
  const productSuccess =
    cookieStore.get(PRODUCTS_FLASH_COOKIES.productSuccess)?.value ??
    resolvedSearchParams?.productSuccess;

  const [{ data: categories }, { data: subcategories }, { data: products }, { data: allProductRows }] =
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
        .select("id, name, slug, status, price, category_id, subcategory_id, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("products")
        .select("id, category_id, subcategory_id")
        .is("deleted_at", null)
        .not("subcategory_id", "is", null),
    ]);

  const { data: inventoryRows } = await supabase
    .from("inventory_stock")
    .select("id, product_id, quantity, low_stock_threshold")
    .not("product_id", "is", null);

  const categoryMap = new Map(categories?.map((category) => [category.id, category.name]) ?? []);
  const subcategoryMap = new Map(
    subcategories?.map((subcategory) => [subcategory.id, subcategory.name]) ?? [],
  );
  const inventoryMap = new Map(inventoryRows?.map((row) => [row.product_id ?? "", row]) ?? []);
  const categoryProductCounts = new Map<string, number>();
  const subcategoryProductCounts = new Map<string, number>();
  const subcategoriesByCategory = new Map<
    string,
    NonNullable<typeof subcategories>[number][]
  >();

  for (const product of allProductRows ?? []) {
    categoryProductCounts.set(
      product.category_id,
      (categoryProductCounts.get(product.category_id) ?? 0) + 1,
    );

    const subcategoryId = product.subcategory_id;

    if (!subcategoryId) {
      continue;
    }

    subcategoryProductCounts.set(
      subcategoryId,
      (subcategoryProductCounts.get(subcategoryId) ?? 0) + 1,
    );
  }

  for (const subcategory of subcategories ?? []) {
    const scopedSubcategories = subcategoriesByCategory.get(subcategory.category_id) ?? [];
    scopedSubcategories.push(subcategory);
    subcategoriesByCategory.set(subcategory.category_id, scopedSubcategories);
  }

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
            This admin slice now supports the real catalog structure you described:
            categories, dynamic subcategories, richer products, and inventory-linked
            records.
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
              <CategoryCreateForm
                action={createCategoryAction}
                errorMessage={categoryError}
                resetToken={categorySuccess}
              />
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-ivory)]">
                Create subcategory
              </h2>
              <SubcategoryCreateForm
                action={createSubcategoryAction}
                categories={
                  categories?.map((category) => ({
                    id: category.id,
                    name: category.name,
                  })) ?? []
                }
                errorMessage={subcategoryError}
                resetToken={subcategorySuccess}
              />
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                    Category structure
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-ivory)]">
                    Categories and subcategories
                  </h2>
                </div>
                <p className="text-sm text-white/55">{categories?.length ?? 0} categories</p>
              </div>
              <div className="mt-4">
                <ErrorMessage message={structureError} />
              </div>
              <CategoryStructureTree
                categories={
                  categories?.map((category) => ({
                    id: category.id,
                    name: category.name,
                    sortOrder: category.sort_order,
                    isActive: category.is_active,
                    productCount: categoryProductCounts.get(category.id) ?? 0,
                    subcategoryCount: (subcategoriesByCategory.get(category.id) ?? []).length,
                    subcategories: [...(subcategoriesByCategory.get(category.id) ?? [])]
                      .sort((left, right) => left.sort_order - right.sort_order)
                      .map((subcategory) => ({
                        id: subcategory.id,
                        name: subcategory.name,
                        sortOrder: subcategory.sort_order,
                        isActive: subcategory.is_active,
                        productCount: subcategoryProductCounts.get(subcategory.id) ?? 0,
                      })),
                  })) ?? []
                }
                onDeleteCategory={deleteCategoryAction}
                onDeleteSubcategory={deleteSubcategoryAction}
                onToggleCategoryStatus={toggleCategoryStatusAction}
                onToggleSubcategoryStatus={toggleSubcategoryStatusAction}
              />
            </Surface>
          </div>

          <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-ivory)]">
              Create product
            </h2>
            <ProductForm
              action={createProductAction}
              buttonLabel="Create product"
              categories={
                categories?.map((category) => ({
                  id: category.id,
                  name: category.name,
                })) ?? []
              }
              defaultValues={{
                name: "",
                slug: "",
                sku: "",
                shortDescription: "",
                description: "",
                categoryId: "",
                subcategoryId: "",
                status: "draft",
                productType: "ready_stock",
                price: "",
                compareAtPrice: "",
                leadTimeDays: "",
                stockQuantity: "0",
                lowStockThreshold: "3",
                story: "",
                sustainabilityInfo: "",
                careInstructions: "",
                isFeatured: false,
                isBestSeller: false,
                isLimitedEdition: false,
              }}
              errorMessage={productError}
              resetToken={productSuccess}
              storageKey="bb-admin-product-create-form"
              existingImages={[]}
              subcategories={
                subcategories?.map((subcategory) => ({
                  id: subcategory.id,
                  categoryId: subcategory.category_id,
                  name: subcategory.name,
                })) ?? []
              }
            />

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                  Recent products
                </p>
                <Link
                  className="text-sm font-semibold text-[var(--color-bonita-ivory)]"
                  href="/inventory"
                >
                  Inventory view
                </Link>
              </div>
              {products?.length ? (
                products.map((product) => {
                  const inventory = inventoryMap.get(product.id);

                  return (
                    <div
                      className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm"
                      key={product.id}
                    >
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
