import Link from "next/link";
import { Surface } from "@beads-bonita/ui/surface";
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

export function CatalogFilters({
  activeCategorySlug,
  activeSort,
  categories,
  subcategories,
}: {
  activeCategorySlug?: string;
  activeSort: CatalogSort;
  categories: StoreCategory[];
  subcategories: StoreSubcategory[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <Surface className="border-white/40 bg-white/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
          Browse by category
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            className={`rounded-full px-4 py-2 text-sm transition ${
              !activeCategorySlug
                ? "bg-[var(--color-bonita-charcoal)] text-[var(--color-bonita-ivory)]"
                : "bg-white/55 text-[var(--color-bonita-charcoal)] hover:bg-white/75"
            }`}
            href="/shop"
          >
            All products
          </Link>
          {categories.map((category) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategorySlug === category.slug
                  ? "bg-[var(--color-bonita-charcoal)] text-[var(--color-bonita-ivory)]"
                  : "bg-white/55 text-[var(--color-bonita-charcoal)] hover:bg-white/75"
              }`}
              href={buildShopHref({ categorySlug: category.slug, sort: activeSort })}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
        </div>
        {subcategories.length ? (
          <div className="mt-5 border-t border-white/40 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-clay)]">
              Subcategories
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {subcategories.map((subcategory) => (
                <Link
                  className="rounded-full bg-white/45 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--color-bonita-charcoal)] transition hover:bg-white/75"
                  href={buildShopHref({
                    categorySlug: activeCategorySlug,
                    subcategorySlug: subcategory.slug,
                    sort: activeSort,
                  })}
                  key={subcategory.id}
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </Surface>

      <Surface className="border-white/40 bg-white/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
          Sort
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeSort === option.value
                  ? "bg-[var(--color-bonita-charcoal)] text-[var(--color-bonita-ivory)]"
                  : "bg-white/55 text-[var(--color-bonita-charcoal)] hover:bg-white/75"
              }`}
              href={buildShopHref({
                categorySlug: activeCategorySlug,
                sort: option.value,
              })}
              key={option.value}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </Surface>
    </div>
  );
}
