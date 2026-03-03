import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@beads-bonita/core";
import { Button } from "@beads-bonita/ui/button";
import { type HomeNavItem } from "./_components/home-mega-nav";
import { HomeTopChrome } from "./_components/home-top-chrome";
import { getCatalogContext, getPublishedProducts } from "./_lib/catalog";

function formatCategoryLabel(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default async function Page() {
  const [{ categories, subcategoriesByCategory }, featuredProducts] = await Promise.all([
    getCatalogContext(),
    getPublishedProducts({ sort: "featured", limit: 6 }),
  ]);

  const navCategories = categories;

  const navItems: HomeNavItem[] = await Promise.all(
    navCategories.map(async (category) => {
      const subcategories = subcategoriesByCategory.get(category.id) ?? [];
      const categoryProducts = await getPublishedProducts({
        categoryId: category.id,
        sort: "featured",
        limit: 8,
      });

      const highlightProduct =
        categoryProducts.find((product) => product.isBestSeller) ??
        categoryProducts.find((product) => product.isLimitedEdition) ??
        categoryProducts[0] ??
        null;

      const subcategoryEntries = await Promise.all(
        (subcategories.length
          ? subcategories
          : [
              {
                id: `${category.id}-all`,
                slug: category.slug,
                name: `All ${category.name}`,
              },
            ]
        ).map(async (subcategory) => {
          const products = subcategories.length
            ? await getPublishedProducts({
                subcategoryId: subcategory.id,
                sort: "featured",
                limit: 4,
              })
            : categoryProducts.slice(0, 4);

          return {
            label: subcategory.name,
            href: subcategories.length
              ? `/subcategory/${subcategory.slug}`
              : `/category/${category.slug}`,
            products: products.map((product) => ({
              id: product.id,
              name: product.name,
              href: `/product/${product.slug}`,
              imageUrl: product.primaryImageUrl,
              price: formatPrice(product.price),
            })),
          };
        }),
      );

      return {
        label: formatCategoryLabel(category.name),
        href: `/category/${category.slug}`,
        description: `Explore ${category.name.toLowerCase()} through handcrafted pieces, live inventory, and an editorial browsing flow.`,
        subcategories: subcategoryEntries.filter((entry) => entry.products.length > 0),
        highlight: {
          title: highlightProduct?.name ?? `${category.name} spotlight`,
          body:
            highlightProduct?.shortDescription ??
            `A curated Bonita entry point into ${category.name.toLowerCase()}, built to feel collected, layered, and giftable.`,
          href: highlightProduct
            ? `/product/${highlightProduct.slug}`
            : `/category/${category.slug}`,
          imageUrl: highlightProduct?.primaryImageUrl ?? null,
          badge: highlightProduct?.isBestSeller
            ? "Best seller"
            : highlightProduct?.isLimitedEdition
              ? "Limited edition"
              : "Category highlight",
        },
      };
    }),
  );

  const heroProduct = featuredProducts[0] ?? null;
  const spotlightProducts = featuredProducts.slice(1, 4);

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

        <HomeTopChrome brandName={brand.name} items={navItems} slides={featuredProducts.slice(0, 4).map((product) => ({
          id: product.id,
          href: `/product/${product.slug}`,
          label: product.isLimitedEdition
            ? `Limited edition: ${product.name}. Discover it now.`
            : product.isBestSeller
              ? `Best seller spotlight: ${product.name}. Shop the favorite piece.`
              : `Featured now: ${product.name}. Explore the product page.`,
        }))} />

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

      <section className="relative z-10 -mt-16 px-6 pb-10 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/60 bg-[rgba(255,255,255,0.82)] p-7 shadow-[0_24px_70px_rgba(36,28,21,0.08)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
              Bonita world
            </p>
            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-bonita-charcoal)] sm:text-5xl">
                  A homepage that behaves like an editorial storefront, not a template.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
                  Hover through the navigation to move from mood into discovery, then continue through live categories and featured products already flowing from your catalog.
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
                href="/shop"
              >
                Browse the catalog
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/55 bg-[linear-gradient(180deg,rgba(232,240,235,0.9),rgba(244,236,225,0.86))] p-7 shadow-[0_24px_70px_rgba(36,28,21,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
              Current focus
            </p>
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-3xl font-[family-name:var(--font-display)] text-[var(--color-bonita-charcoal)]">
                  {categories.length} live categories
                </p>
                <p className="mt-2 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                  Structured browsing for category, subcategory, product detail, cart, checkout, and account flows.
                </p>
              </div>
              <div>
                <p className="text-3xl font-[family-name:var(--font-display)] text-[var(--color-bonita-charcoal)]">
                  {featuredProducts.length} featured pieces
                </p>
                <p className="mt-2 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                  Real admin-managed products, usable immediately for launch storytelling and visual merchandising.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[1540px]">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
                Featured now
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)] sm:text-5xl">
                Pieces chosen to carry the front page.
              </h2>
            </div>
            <Link
              className="hidden text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)] sm:inline-flex"
              href="/shop?sort=featured"
            >
              View all featured
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <Link
              className="group relative min-h-[540px] overflow-hidden rounded-[2.2rem] border border-white/60 bg-[linear-gradient(135deg,#dff1ea_0%,#b7e5df_42%,#f4ece1_100%)]"
              href={heroProduct ? `/product/${heroProduct.slug}` : "/shop"}
            >
              {heroProduct?.primaryImageUrl ? (
                <Image
                  alt={heroProduct.name}
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={heroProduct.primaryImageUrl}
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,14,0.02),rgba(6,14,14,0.5))]" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
                  Hero selection
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
                  {heroProduct?.name ?? "Bonita signature piece"}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                  {heroProduct?.shortDescription ??
                    "Designed to anchor the page with presence, texture, and a premium first impression."}
                </p>
              </div>
            </Link>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {spotlightProducts.map((product) => (
                <Link
                  className="group relative min-h-[257px] overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,#eef4ef_0%,#d6e6dd_38%,#f4ece1_100%)]"
                  href={`/product/${product.slug}`}
                  key={product.id}
                >
                  {product.primaryImageUrl ? (
                    <Image
                      alt={product.name}
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      src={product.primaryImageUrl}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,17,0.04),rgba(11,17,17,0.42))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                      Featured product
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-white/78">{product.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                className="group rounded-[2rem] border border-white/65 bg-white/80 p-7 shadow-[0_16px_40px_rgba(38,30,22,0.06)] transition duration-300 hover:-translate-y-1 hover:bg-white"
                href={`/category/${category.slug}`}
                key={category.id}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-moss)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
                  {category.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                  Enter the {category.name.toLowerCase()} collection through structured browsing and product storytelling.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-bonita-cocoa)] transition group-hover:text-[var(--color-bonita-moss)]">
                  Explore
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}



