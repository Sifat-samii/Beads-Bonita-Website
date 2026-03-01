import { notFound } from "next/navigation";
import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { ProductCard } from "../../_components/product-card";
import { StorefrontFrame } from "../../_components/storefront-frame";
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
      <section className="pt-4">
        <SectionHeading
          eyebrow={category?.name ?? "Subcategory"}
          title={subcategory.name}
          description={`A focused edit from the ${category?.name ?? "catalog"} collection with published handcrafted pieces in this subcategory.`}
        />
      </section>

      <section className="grid gap-5 pb-8 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            categoryName={category?.name ?? "Collection"}
            key={product.id}
            product={product}
            subcategoryName={subcategory.name}
          />
        ))}
      </section>
    </StorefrontFrame>
  );
}
