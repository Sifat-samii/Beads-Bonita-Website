import { notFound } from "next/navigation";
import { Surface } from "@beads-bonita/ui/surface";
import { ProductCard } from "../../_components/product-card";
import { StorefrontFrame } from "../../_components/storefront-frame";
import { StorefrontPageHero } from "../../_components/storefront-page-hero";
import { getCatalogContext, getPublishedProducts } from "../../_lib/catalog";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { categoryMap, subcategoryBySlug } = await getCatalogContext();
  const subcategory = subcategoryBySlug.get(slug);

  if (!subcategory) {
    notFound();
  }

  const category = categoryMap.get(subcategory.categoryId);
  const products = await getPublishedProducts({
    categoryId: subcategory.categoryId,
    subcategoryId: subcategory.id,
    sort: "featured",
  });

  return (
    <StorefrontFrame currentPath="/shop">
      <StorefrontPageHero
        accent={`${products.length} storefront-visible products currently belong to this subcategory.`}
        description={`A narrower edit from the ${category?.name ?? "catalog"} collection, intended for faster discovery and stronger merchandising focus.`}
        eyebrow={category?.name ?? "Subcategory"}
        primaryCta={{ href: `/shop?category=${category?.slug ?? ""}&subcategory=${subcategory.slug}`, label: "Open in shop" }}
        secondaryCta={category ? { href: `/category/${category.slug}`, label: "Back to category" } : undefined}
        title={subcategory.name}
      />

      <section className="grid gap-5 xl:grid-cols-[0.24fr_1fr]">
        <Surface className="h-fit rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.8)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Context
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
            <p>Collection: {category?.name ?? "Bonita catalog"}</p>
            <p>Subcategory: {subcategory.name}</p>
            <p>Visibility: Published only</p>
          </div>
        </Surface>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              categoryName={category?.name ?? "Collection"}
              key={product.id}
              product={product}
              subcategoryName={subcategory.name}
            />
          ))}
        </div>
      </section>
    </StorefrontFrame>
  );
}
