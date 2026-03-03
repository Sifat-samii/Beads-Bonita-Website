import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Surface } from "@beads-bonita/ui/surface";
import { ProductCard } from "../../_components/product-card";
import { StorefrontFrame } from "../../_components/storefront-frame";
import { StorefrontPageHero } from "../../_components/storefront-page-hero";
import { getCatalogContext, getPublishedProducts } from "../../_lib/catalog";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { categoryBySlug, subcategoriesByCategory } = await getCatalogContext();
  const category = categoryBySlug.get(slug);

  if (!category) {
    notFound();
  }

  const subcategories = subcategoriesByCategory.get(category.id) ?? [];
  const products = await getPublishedProducts({
    categoryId: category.id,
    sort: "featured",
  });
  const subcategoryMap = new Map(
    subcategories.map((subcategory) => [subcategory.id, subcategory.name]),
  );

  return (
    <StorefrontFrame currentPath="/shop">
      <StorefrontPageHero
        accent={`${subcategories.length} published subcategories available under this collection.`}
        description={`Browse the visible ${category.name.toLowerCase()} edit and move directly into the pieces that are currently live on the storefront.`}
        eyebrow="Category"
        primaryCta={{ href: `/shop?category=${category.slug}`, label: "Refine in shop" }}
        secondaryCta={{ href: "/shop", label: "All categories" }}
        title={category.name}
      />

      <section className="grid gap-5 xl:grid-cols-[0.26fr_1fr]">
        <Surface className="h-fit rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.8)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Visible subcategories
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {subcategories.length ? (
              subcategories.map((subcategory) => (
                <Link
                  className="rounded-full bg-[rgba(237,244,240,0.92)] px-4 py-2 text-sm text-[var(--color-bonita-charcoal)] transition hover:bg-white"
                  href={`/subcategory/${subcategory.slug}`}
                  key={subcategory.id}
                >
                  {subcategory.name}
                </Link>
              ))
            ) : (
              <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
                This category currently has no published subcategory branches.
              </p>
            )}
          </div>
        </Surface>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              categoryName={category.name}
              key={product.id}
              product={product}
              subcategoryName={
                product.subcategoryId ? subcategoryMap.get(product.subcategoryId) : undefined
              }
            />
          ))}
        </div>
      </section>
    </StorefrontFrame>
  );
}
