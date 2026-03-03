import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  const leadTimeText = product.leadTimeDays
    ? `Lead time ${product.leadTimeDays} days before dispatch.`
    : "Ready-stock piece with standard processing and dispatch.";

  return (
    <StorefrontFrame currentPath="/shop">
      <section className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <div className="space-y-5">
          <Surface className="overflow-hidden rounded-[2.25rem] border-white/65 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(237,244,240,0.72)_38%,rgba(244,236,225,0.86)_100%)] p-4 sm:p-5">
            {images.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((image, index) => (
                  <div
                    className={`relative overflow-hidden rounded-[1.8rem] bg-white/60 ${
                      index === 0 ? "sm:col-span-2 aspect-[1.08]" : "aspect-[0.9]"
                    }`}
                    key={image.id}
                  >
                    <Image
                      alt={image.altText ?? product.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 40vw"
                      src={image.url}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,22,22,0.02),rgba(18,22,22,0.14))]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[32rem] items-end rounded-[1.8rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_26%),linear-gradient(135deg,#edf4f0_0%,#dce8e0_45%,#f4ece1_100%)] p-7">
                <div className="max-w-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                    Product imagery
                  </p>
                  <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                    This product is live, but its media gallery has not been completed yet.
                    The detail page remains usable while the admin media set is expanded.
                  </p>
                </div>
              </div>
            )}
          </Surface>

          <div className="grid gap-5 md:grid-cols-3">
            <Surface className="rounded-[1.8rem] border-white/65 bg-[rgba(255,255,255,0.78)] p-5 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-moss)]">
                Product details
              </p>
              <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                {product.description}
              </p>
            </Surface>

            <div className="space-y-5">
              <Surface className="rounded-[1.8rem] border-white/65 bg-[rgba(255,255,255,0.78)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-clay)]">
                  Fulfillment
                </p>
                <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                  {leadTimeText}
                </p>
              </Surface>

              {product.story ? (
                <Surface className="rounded-[1.8rem] border-white/65 bg-[rgba(255,255,255,0.78)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-clay)]">
                    Handmade story
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                    {product.story}
                  </p>
                </Surface>
              ) : null}

              {product.sustainabilityInfo ? (
                <Surface className="rounded-[1.8rem] border-white/65 bg-[rgba(255,255,255,0.78)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-clay)]">
                    Sustainability
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                    {product.sustainabilityInfo}
                  </p>
                </Surface>
              ) : null}

              {product.careInstructions ? (
                <Surface className="rounded-[1.8rem] border-white/65 bg-[rgba(255,255,255,0.78)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-clay)]">
                    Care
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                    {product.careInstructions}
                  </p>
                </Surface>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Surface className="rounded-[2.25rem] border-white/65 bg-[rgba(255,255,255,0.84)] p-7 shadow-[0_20px_55px_rgba(34,27,20,0.07)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-bonita-moss)]">
              {category?.name ?? "Collection"}
              {subcategory ? ` / ${subcategory.name}` : ""}
            </p>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.92] tracking-[-0.04em] text-[var(--color-bonita-charcoal)] sm:text-[4.4rem]">
              {product.name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
              {product.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  className="rounded-full border border-black/8 bg-[rgba(237,244,240,0.9)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
                  key={badge}
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-3xl font-semibold text-[var(--color-bonita-charcoal)]">
                  {formatCurrency(product.price)}
                </p>
                {product.compareAtPrice ? (
                  <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_40%,white)] line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </p>
                ) : null}
              </div>
              {product.sku ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                  SKU {product.sku}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
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

            <div className="mt-8 grid gap-4 border-t border-black/6 pt-6 sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-[rgba(237,244,240,0.72)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                  Purchase mode
                </p>
                <p className="mt-2 text-sm text-[var(--color-bonita-charcoal)]">
                  {product.productType.replaceAll("_", " ")}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[rgba(244,236,225,0.78)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                  Checkout path
                </p>
                <p className="mt-2 text-sm text-[var(--color-bonita-charcoal)]">
                  Server-validated before payment.
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.8)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                  Continue browsing
                </p>
                <p className="mt-2 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
                  Move back into the visible collection or return to the full catalog.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {category ? (
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
                    href={`/category/${category.slug}`}
                  >
                    Category
                    <ArrowRight className="size-4" />
                  </Link>
                ) : null}
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
                  href="/shop"
                >
                  Shop
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </Surface>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                Related pieces
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em] text-[var(--color-bonita-charcoal)]">
                Continue the collection
              </h2>
            </div>
            <Link
              className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
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
