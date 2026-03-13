import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Recycle, ShieldCheck } from "lucide-react";
import { brand } from "@beads-bonita/core";
import { Button } from "@beads-bonita/ui/button";
import { BestSellersShowcase } from "./_components/best-sellers-showcase";
import { FeaturedProductsSpotlight } from "./_components/featured-products-spotlight";
import { ShopByCategoryShowcase } from "./_components/shop-by-category-showcase";
import { StorefrontFooter } from "./_components/storefront-footer";
import { HomeTopChrome } from "./_components/home-top-chrome";
import { getPublishedProducts } from "./_lib/catalog";
import { getHomeChromeData } from "./_lib/home-chrome";

export default async function Page() {
  const [
    { categories, featuredProducts, navItems },
    bestSellerCandidates,
    categoryImageCandidates,
  ] = await Promise.all([
    getHomeChromeData(),
    getPublishedProducts({ sort: "featured", limit: 16 }),
    getPublishedProducts({ sort: "featured", limit: 160 }),
  ]);

  const heroProduct = featuredProducts[0] ?? null;
  const bestSellerProducts = (
    bestSellerCandidates.filter((product) => product.isBestSeller).length
      ? bestSellerCandidates.filter((product) => product.isBestSeller)
      : bestSellerCandidates
  ).slice(0, 8);
  const categorySpotlightImages = new Map<string, string | null>();
  const imagesByCategoryId = new Map<string, string[]>();

  for (const product of categoryImageCandidates) {
    if (!product.primaryImageUrl) {
      continue;
    }

    const items = imagesByCategoryId.get(product.categoryId) ?? [];
    items.push(product.primaryImageUrl);
    imagesByCategoryId.set(product.categoryId, items);
  }

  for (const category of categories) {
    const images = imagesByCategoryId.get(category.id) ?? [];

    if (!images.length) {
      categorySpotlightImages.set(category.id, null);
      continue;
    }

    const hash = category.id
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    categorySpotlightImages.set(category.id, images[hash % images.length] ?? null);
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[var(--color-bonita-charcoal)]">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroProduct?.primaryImageUrl ? (
            <Image
              alt={heroProduct.name}
              className="object-cover"
              fill
              priority
              sizes="100vw"
              src={heroProduct.primaryImageUrl}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_22%),linear-gradient(90deg,#0f5a5a_0%,#1e8b88_32%,#9be2df_50%,#146969_72%,#0f4a4a_100%)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,20,0.28)_0%,rgba(9,19,19,0.12)_26%,rgba(7,15,15,0.36)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.22),transparent_24%)]" />
        </div>

        <HomeTopChrome brandName={brand.name} items={navItems} slides={
          featuredProducts.length > 0
            ? featuredProducts.slice(0, 4).map((product) => ({
                id: product.id,
                href: `/product/${product.slug}`,
                label: product.isLimitedEdition
                  ? `Limited edition: ${product.name}. Discover it now.`
                  : product.isBestSeller
                    ? `Best seller spotlight: ${product.name}. Shop the favorite piece.`
                    : `Featured now: ${product.name}. Explore the product page.`,
              }))
            : [
                {
                  id: "bonita-shop-banner",
                  href: "/shop",
                  label: "Featured now: discover the Bonita collection and shop the latest pieces.",
                },
              ]
        } />

        <div className="relative z-10 flex min-h-screen items-end justify-center px-6 pb-16 pt-40 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
          <div className="w-full max-w-[920px] text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/70">
              Handcrafted jewelry, editorial presence
            </p>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl leading-none tracking-[-0.05em] sm:text-7xl lg:text-[6rem]">
              {heroProduct?.name ?? "Collected pieces with quiet presence."}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              {heroProduct?.shortDescription ??
                "Small-batch jewelry designed to feel intimate, giftable, and visually memorable from the first screen."}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href={heroProduct ? `/product/${heroProduct.slug}` : "/shop"}>
                <Button className="!min-h-14 !bg-white !px-8 !text-[var(--color-bonita-charcoal)] hover:!bg-[#f2ece5]">
                  Shop now
                </Button>
              </Link>
              <Link
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/22 bg-white/10 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/16"
                href="/shop"
              >
                Explore all pieces
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProductsSpotlight products={featuredProducts} />

      <BestSellersShowcase products={bestSellerProducts} />

      <ShopByCategoryShowcase
        categories={categories.map((category) => ({
          id: category.id,
          imageUrl: categorySpotlightImages.get(category.id) ?? null,
          name: category.name,
          slug: category.slug,
        }))}
      />

      <section className="bg-[#f7f5f2] px-6 pb-24 pt-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(140deg,rgba(232,243,236,0.82)_0%,rgba(245,239,228,0.88)_58%,rgba(219,236,228,0.84)_100%)] p-8 sm:p-10">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(157,203,193,0.24),transparent_68%)] blur-2xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(211,180,167,0.18),transparent_72%)] blur-2xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
                  Sustainability
                </p>
                <h2 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-none tracking-[-0.04em] text-[var(--color-bonita-charcoal)] sm:text-[3.7rem]">
                  Thoughtful materials, mindful making.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)] sm:text-base">
                  Bonita is building a calmer, low-waste product path where every piece is
                  designed for long use, thoughtful care, and fewer throwaway cycles.
                </p>
                <Link
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
                  href="/sustainability"
                >
                  Explore sustainability
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/55 bg-[rgba(255,255,255,0.8)] p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(237,244,240,0.9)] text-[var(--color-bonita-moss)]">
                  <Leaf className="size-5" />
                </span>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-bonita-charcoal)]">
                  Mindful materials
                </p>
                <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                  Material and finish choices are moving toward durability and lower waste.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/55 bg-[rgba(255,255,255,0.8)] p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(237,244,240,0.9)] text-[var(--color-bonita-moss)]">
                  <Recycle className="size-5" />
                </span>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-bonita-charcoal)]">
                  Longer product life
                </p>
                <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                  Care-first guidance helps each piece stay wearable for years, not seasons.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/55 bg-[rgba(255,255,255,0.8)] p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(237,244,240,0.9)] text-[var(--color-bonita-moss)]">
                  <ShieldCheck className="size-5" />
                </span>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-bonita-charcoal)]">
                  Better sourcing
                </p>
                <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                  Supplier and production decisions are being refined around transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}



