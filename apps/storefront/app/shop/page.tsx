import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { Surface } from "@beads-bonita/ui/surface";
import { CatalogFilters } from "../_components/catalog-filters";
import { ProductCard } from "../_components/product-card";
import { StorefrontFrame } from "../_components/storefront-frame";
import {
  getCatalogContext,
  getPublishedProducts,
  type CatalogSort,
} from "../_lib/catalog";

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string;
    subcategory?: string;
    sort?: string;
  }>;
};

const validSorts: CatalogSort[] = ["newest", "price-asc", "price-desc", "featured"];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const sort = validSorts.includes(resolvedSearchParams?.sort as CatalogSort)
    ? (resolvedSearchParams?.sort as CatalogSort)
    : "newest";
  const { categories, categoryBySlug, subcategoryBySlug, subcategoriesByCategory } =
    await getCatalogContext();
  const activeCategory = resolvedSearchParams?.category
    ? categoryBySlug.get(resolvedSearchParams.category) ?? null
    : null;
  const activeSubcategory = resolvedSearchParams?.subcategory
    ? subcategoryBySlug.get(resolvedSearchParams.subcategory) ?? null
    : null;
  const scopedSubcategories = activeCategory
    ? subcategoriesByCategory.get(activeCategory.id) ?? []
    : [];
  const products = await getPublishedProducts({
    categoryId: activeCategory?.id,
    subcategoryId:
      activeSubcategory && activeSubcategory.categoryId === activeCategory?.id
        ? activeSubcategory.id
        : undefined,
    sort,
  });
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
  const subcategoryNameMap = new Map(
    scopedSubcategories.map((subcategory) => [subcategory.id, subcategory.name]),
  );

  return (
    <StorefrontFrame currentPath="/shop">
      <section className="pt-4">
        <SectionHeading
          eyebrow="Shop"
          title="A calm catalog shaped for discovery, gifting, and collected everyday adornment."
          description="Browse handmade jewelry by category and subcategory, then move into the product story that makes each piece feel personal."
        />
      </section>

      <CatalogFilters
        activeCategorySlug={activeCategory?.slug}
        activeSort={sort}
        categories={categories}
        subcategories={scopedSubcategories}
      />

      <section className="space-y-6 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              Catalog results
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
              {activeSubcategory?.name ??
                activeCategory?.name ??
                "All handcrafted collections"}
            </h2>
          </div>
          <p className="text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
            {products.length} products
          </p>
        </div>

        {products.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                categoryName={categoryMap.get(product.categoryId) ?? "Collection"}
                key={product.id}
                product={product}
                subcategoryName={
                  product.subcategoryId
                    ? subcategoryNameMap.get(product.subcategoryId)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <Surface className="border-white/40 bg-white/60 p-8">
            <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
              No published products were found for this combination yet. Adjust the
              filters or publish products from the admin catalog.
            </p>
          </Surface>
        )}
      </section>
    </StorefrontFrame>
  );
}
