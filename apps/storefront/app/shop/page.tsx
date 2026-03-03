import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";
import {
  getCatalogContext,
  getPublishedProducts,
  type CatalogSort,
} from "../_lib/catalog";
import { ShopProductTile } from "./shop-product-tile";

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
  const allProducts = await getPublishedProducts({ sort: "newest" });
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
  const categoryCounts = new Map<string, number>();
  const subcategoryCounts = new Map<string, number>();

  for (const product of allProducts) {
    categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) ?? 0) + 1);

    if (product.subcategoryId) {
      subcategoryCounts.set(
        product.subcategoryId,
        (subcategoryCounts.get(product.subcategoryId) ?? 0) + 1,
      );
    }
  }

  const selectedTitle =
    activeSubcategory?.name ?? activeCategory?.name ?? "Shop All";

  const selectedDescription = activeSubcategory
    ? `Published pieces currently visible under ${activeSubcategory.name}.`
    : activeCategory
      ? `Discover the visible ${activeCategory.name.toLowerCase()} collection and continue into product detail pages or cart.`
      : "Discover the currently published Bonita catalog across every visible category.";

  const sortLabel =
    {
      newest: "Newest",
      "price-asc": "Price: Low to high",
      "price-desc": "Price: High to low",
      featured: "Featured",
    }[sort] ?? "Newest";

  function buildShopHref(input: {
    categorySlug?: string;
    subcategorySlug?: string;
    sort?: CatalogSort;
  }) {
    const params = new URLSearchParams();

    if (input.categorySlug) {
      params.set("category", input.categorySlug);
    }

    if (input.subcategorySlug) {
      params.set("subcategory", input.subcategorySlug);
    }

    if (input.sort && input.sort !== "newest") {
      params.set("sort", input.sort);
    }

    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  }

  return (
    <StorefrontFrame currentPath="/shop">
      <section className="overflow-hidden rounded-[2rem] border border-black/6 bg-[rgba(255,255,255,0.82)]">
        <div className="border-b border-black/6 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_62%,white)]">
            <Link className="transition hover:text-[var(--color-bonita-charcoal)]" href="/">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-[var(--color-bonita-charcoal)]">{selectedTitle}</span>
          </div>
        </div>

        <div className="border-b border-black/6 px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
            Shop
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl tracking-[-0.04em] text-[var(--color-bonita-charcoal)] sm:text-[4.4rem]">
            {selectedTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)] sm:text-base">
            {selectedDescription}
          </p>
        </div>

        <div className="border-b border-black/6 px-6 py-4 sm:px-8">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <details className="group relative">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-[1rem] border border-black/10 bg-white/82 px-4 text-sm text-[var(--color-bonita-charcoal)]">
                <span>{activeCategory?.name ?? "All Categories"}</span>
                <ChevronDown className="size-4 transition group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 min-w-full rounded-[1rem] border border-black/8 bg-white p-2 shadow-[0_18px_40px_rgba(34,27,20,0.08)]">
                <Link
                  className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[#f3f1eb]"
                  href={buildShopHref({ sort })}
                >
                  All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[#f3f1eb]"
                    href={buildShopHref({ categorySlug: category.slug, sort })}
                    key={category.id}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group relative">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-[1rem] border border-black/10 bg-white/82 px-4 text-sm text-[var(--color-bonita-charcoal)]">
                <span>{activeSubcategory?.name ?? "All Subcategories"}</span>
                <ChevronDown className="size-4 transition group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 min-w-full rounded-[1rem] border border-black/8 bg-white p-2 shadow-[0_18px_40px_rgba(34,27,20,0.08)]">
                <Link
                  className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[#f3f1eb]"
                  href={buildShopHref({
                    categorySlug: activeCategory?.slug,
                    sort,
                  })}
                >
                  All Subcategories
                </Link>
                {scopedSubcategories.map((subcategory) => (
                  <Link
                    className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[#f3f1eb]"
                    href={buildShopHref({
                      categorySlug: activeCategory?.slug,
                      subcategorySlug: subcategory.slug,
                      sort,
                    })}
                    key={subcategory.id}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group relative">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-[1rem] border border-black/10 bg-white/82 px-4 text-sm text-[var(--color-bonita-charcoal)]">
                <span>Sort: {sortLabel}</span>
                <ChevronDown className="size-4 transition group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 min-w-full rounded-[1rem] border border-black/8 bg-white p-2 shadow-[0_18px_40px_rgba(34,27,20,0.08)]">
                {validSorts.map((option) => (
                  <Link
                    className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[#f3f1eb]"
                    href={buildShopHref({
                      categorySlug: activeCategory?.slug,
                      subcategorySlug: activeSubcategory?.slug,
                      sort: option,
                    })}
                    key={option}
                  >
                    {{
                      newest: "Newest",
                      "price-asc": "Price: Low to high",
                      "price-desc": "Price: High to low",
                      featured: "Featured",
                    }[option]}
                  </Link>
                ))}
              </div>
            </details>

            <div className="flex items-center lg:justify-end">
              <Link
                className="text-sm font-medium text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)] transition hover:text-[var(--color-bonita-charcoal)]"
                href="/shop"
              >
                Clear Filters
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <Surface className="rounded-[1.8rem] border-black/6 bg-[rgba(255,255,255,0.82)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-bonita-charcoal)]">
              Categories
            </h2>
            <div className="mt-5 space-y-3">
              <Link
                className={`flex items-center justify-between gap-3 text-sm transition ${
                  !activeCategory ? "text-[var(--color-bonita-charcoal)]" : "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_66%,white)] hover:text-[var(--color-bonita-charcoal)]"
                }`}
                href="/shop"
              >
                <span>All Categories</span>
                <span>{allProducts.length}</span>
              </Link>
              {categories.map((category) => (
                <Link
                  className={`flex items-center justify-between gap-3 text-sm transition ${
                    activeCategory?.id === category.id
                      ? "font-medium text-[var(--color-bonita-charcoal)]"
                      : "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_66%,white)] hover:text-[var(--color-bonita-charcoal)]"
                  }`}
                  href={buildShopHref({ categorySlug: category.slug, sort })}
                  key={category.id}
                >
                  <span>{category.name}</span>
                  <span>{categoryCounts.get(category.id) ?? 0}</span>
                </Link>
              ))}
            </div>
          </Surface>

          {scopedSubcategories.length ? (
            <Surface className="rounded-[1.8rem] border-black/6 bg-[rgba(255,255,255,0.82)] p-6">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-charcoal)]">
                Subcategories
              </h2>
              <div className="mt-5 space-y-3">
                <Link
                  className={`flex items-center justify-between gap-3 text-sm transition ${
                    !activeSubcategory
                      ? "text-[var(--color-bonita-charcoal)]"
                      : "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_66%,white)] hover:text-[var(--color-bonita-charcoal)]"
                  }`}
                  href={buildShopHref({ categorySlug: activeCategory?.slug, sort })}
                >
                  <span>All Subcategories</span>
                </Link>
                {scopedSubcategories.map((subcategory) => (
                  <Link
                    className={`flex items-center justify-between gap-3 text-sm transition ${
                      activeSubcategory?.id === subcategory.id
                        ? "font-medium text-[var(--color-bonita-charcoal)]"
                        : "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_66%,white)] hover:text-[var(--color-bonita-charcoal)]"
                    }`}
                    href={buildShopHref({
                      categorySlug: activeCategory?.slug,
                      subcategorySlug: subcategory.slug,
                      sort,
                    })}
                    key={subcategory.id}
                  >
                    <span>{subcategory.name}</span>
                    <span>{subcategoryCounts.get(subcategory.id) ?? 0}</span>
                  </Link>
                ))}
              </div>
            </Surface>
          ) : null}

          <Surface className="rounded-[1.8rem] border-black/6 bg-[rgba(255,255,255,0.82)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-bonita-charcoal)]">
              Availability
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
              Only published products are shown here. Archived products, subcategories, and
              categories stay hidden across the storefront.
            </p>
          </Surface>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
              Showing <span className="font-semibold text-[var(--color-bonita-charcoal)]">{products.length}</span> products
            </p>
            <div className="flex flex-wrap gap-2">
              {activeCategory ? (
                <span className="rounded-full bg-[rgba(237,244,240,0.9)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-charcoal)]">
                  {activeCategory.name}
                </span>
              ) : null}
              {activeSubcategory ? (
                <span className="rounded-full bg-[rgba(244,236,225,0.9)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-charcoal)]">
                  {activeSubcategory.name}
                </span>
              ) : null}
            </div>
          </div>

          {products.length ? (
            <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ShopProductTile
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
            <Surface className="rounded-[2rem] border-black/6 bg-[rgba(255,255,255,0.82)] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                Nothing visible here yet
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                No published products match this filter combination right now. Clear the
                filters or switch categories to continue browsing.
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
                href="/shop"
              >
                Reset filters
                <ChevronRight className="size-4" />
              </Link>
            </Surface>
          )}
        </div>
      </section>
    </StorefrontFrame>
  );
}
