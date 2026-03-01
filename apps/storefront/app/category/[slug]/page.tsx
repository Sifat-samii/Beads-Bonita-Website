import { notFound } from "next/navigation";
import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { ProductCard } from "../../_components/product-card";
import { StorefrontFrame } from "../../_components/storefront-frame";
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

  const products = await getPublishedProducts({
    categoryId: category.id,
    sort: "featured",
  });
  const subcategoryMap = new Map(
    (subcategoriesByCategory.get(category.id) ?? []).map((subcategory) => [
      subcategory.id,
      subcategory.name,
    ]),
  );

  return (
    <StorefrontFrame currentPath="/shop">
      <section className="pt-4">
        <SectionHeading
          eyebrow="Category"
          title={category.name}
          description={`Browse the published ${category.name.toLowerCase()} collection and move into individual product stories from there.`}
        />
      </section>

      <section className="grid gap-5 pb-8 md:grid-cols-2 xl:grid-cols-3">
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
      </section>
    </StorefrontFrame>
  );
}
