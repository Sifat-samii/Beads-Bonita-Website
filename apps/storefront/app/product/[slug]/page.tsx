import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@beads-bonita/ui/button";
import { Surface } from "@beads-bonita/ui/surface";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductCard } from "../../_components/product-card";
import { StorefrontFrame } from "../../_components/storefront-frame";
import { formatCurrency, getProductBadges } from "../../_lib/catalog-display";
import {
  getCatalogContext,
  getPublishedProductBySlug,
  getRelatedProducts,
} from "../../_lib/catalog";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ product, images }, { categoryMap, subcategories }] = await Promise.all([
    getPublishedProductBySlug(slug),
    getCatalogContext(),
  ]);

  if (!product) {
    notFound();
  }

  const category = categoryMap.get(product.categoryId);
  const subcategory = subcategories.find((item) => item.id === product.subcategoryId);
  const relatedProducts = await getRelatedProducts({
    categoryId: product.categoryId,
    productId: product.id,
    limit: 4,
  });
  const badges = getProductBadges(product);

  return (
    <StorefrontFrame currentPath="/shop">
      <section className="grid gap-6 pt-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Surface className="border-white/40 bg-white/65 p-5">
          {images.length ? (
            <div className="grid gap-4">
              {images.map((image) => (
                <div
                  className="min-h-80 rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,223,208,0.72))] p-4"
                  key={image.id}
                >
                  <div className="flex h-full items-end rounded-[1.35rem] border border-white/50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-bonita-moss)]">
                      {image.altText ?? product.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[32rem] items-end rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(211,180,167,0.26),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.85),rgba(236,223,208,0.72))] p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                  Product imagery
                </p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                  Product image upload is the next admin slice. This placeholder keeps the
                  PDP usable until the media pipeline is added.
                </p>
              </div>
            </div>
          )}
        </Surface>

        <div className="space-y-6">
          <Surface className="border-white/40 bg-white/65 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              {category?.name ?? "Collection"}
              {subcategory ? ` / ${subcategory.name}` : ""}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-6xl leading-none text-[var(--color-bonita-charcoal)]">
              {product.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
              {product.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
                  key={badge}
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-[var(--color-bonita-charcoal)]">
                  {formatCurrency(product.price)}
                </p>
                {product.compareAtPrice ? (
                  <p className="mt-2 text-sm text-white/55 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <AddToCartButton
                  item={{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    categoryName: category?.name ?? "Collection",
                    subcategoryName: subcategory?.name,
                    shortDescription: product.shortDescription,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    productType: product.productType,
                    leadTimeDays: product.leadTimeDays,
                  }}
                />
                <Button variant="secondary">Save</Button>
              </div>
            </div>
          </Surface>

          <Surface className="border-white/40 bg-white/60 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                  Product details
                </p>
                <p className="mt-4 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                  {product.description}
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-white/50 bg-white/55 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                    Fulfillment
                  </p>
                  <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                    {product.leadTimeDays
                      ? `Lead time ${product.leadTimeDays} days before dispatch.`
                      : "Ready stock item with standard processing and delivery timelines."}
                  </p>
                </div>
                {product.story ? (
                  <div className="rounded-[1.5rem] border border-white/50 bg-white/55 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                      Handmade story
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                      {product.story}
                    </p>
                  </div>
                ) : null}
                {product.sustainabilityInfo ? (
                  <div className="rounded-[1.5rem] border border-white/50 bg-white/55 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                      Sustainability
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                      {product.sustainabilityInfo}
                    </p>
                  </div>
                ) : null}
                {product.careInstructions ? (
                  <div className="rounded-[1.5rem] border border-white/50 bg-white/55 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                      Care instructions
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                      {product.careInstructions}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </Surface>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="space-y-6 pb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                Related pieces
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
                Continue the collection
              </h2>
            </div>
            <Link
              className="text-sm font-semibold text-[var(--color-bonita-cocoa)]"
              href="/shop"
            >
              Back to shop
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                categoryName={category?.name ?? "Collection"}
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </div>
        </section>
      ) : null}
    </StorefrontFrame>
  );
}
