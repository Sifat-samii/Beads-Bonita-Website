import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import type {
  CatalogSort,
  StoreCategory,
  StoreSubcategory,
} from "../_lib/catalog";

const sortOptions: { label: string; value: CatalogSort }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to high", value: "price-asc" },
  { label: "Price: High to low", value: "price-desc" },
  { label: "Featured first", value: "featured" },
];

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

function FilterChip({
  active,
  href,
  label,
  subdued,
}: {
  active?: boolean;
  href: string;
  label: string;
  subdued?: boolean;
}) {
  return (
    <Link
      className={`rounded-full px-4 py-2.5 text-sm transition ${
        active
          ? "bg-[var(--color-bonita-charcoal)] text-[var(--color-bonita-ivory)]"
          : subdued
            ? "bg-white/55 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)] hover:bg-white/82 hover:text-[var(--color-bonita-charcoal)]"
            : "bg-[rgba(237,244,240,0.88)] text-[var(--color-bonita-charcoal)] hover:bg-white"
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}

export function CatalogFilters({
  activeCategorySlug,
  activeSort,
  activeSubcategorySlug,
  categories,
  subcategories,
}: {
  activeCategorySlug?: string;
  activeSort: CatalogSort;
  activeSubcategorySlug?: string;
  categories: StoreCategory[];
  subcategories: StoreSubcategory[];
}) {
  return (
    <section className="rounded-[2rem] border border-white/65 bg-[rgba(255,255,255,0.8)] p-5 shadow-[0_18px_45px_rgba(34,27,20,0.05)] sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(237,244,240,0.96)] text-[var(--color-bonita-moss)]">
                <SlidersHorizontal className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                  Browse the catalog
                </p>
                <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_66%,white)]">
                  Filter by published categories and subcategories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <FilterChip active={!activeCategorySlug} href="/shop" label="All products" />
            {categories.map((category) => (
              <FilterChip
                active={activeCategorySlug === category.slug}
                href={buildShopHref({ categorySlug: category.slug, sort: activeSort })}
                key={category.id}
                label={category.name}
              />
            ))}
          </div>

          {subcategories.length ? (
            <div className="border-t border-black/6 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-clay)]">
                Refine further
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <FilterChip
                  active={!activeSubcategorySlug}
                  href={buildShopHref({
                    categorySlug: activeCategorySlug,
                    sort: activeSort,
                  })}
                  label="All in category"
                  subdued
                />
                {subcategories.map((subcategory) => (
                  <FilterChip
                    active={activeSubcategorySlug === subcategory.slug}
                    href={buildShopHref({
                      categorySlug: activeCategorySlug,
                      subcategorySlug: subcategory.slug,
                      sort: activeSort,
                    })}
                    key={subcategory.id}
                    label={subcategory.name}
                    subdued
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.6rem] border border-black/6 bg-[linear-gradient(180deg,rgba(237,244,240,0.82),rgba(244,236,225,0.9))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Sort the edit
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {sortOptions.map((option) => (
              <FilterChip
                active={activeSort === option.value}
                href={buildShopHref({
                  categorySlug: activeCategorySlug,
                  subcategorySlug: activeSubcategorySlug,
                  sort: option.value,
                })}
                key={option.value}
                label={option.label}
                subdued
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
