import Link from "next/link";
import { brand } from "@beads-bonita/core";
import { Button } from "@beads-bonita/ui/button";
import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { StatChip } from "@beads-bonita/ui/stat-chip";
import { Surface } from "@beads-bonita/ui/surface";
import { ArrowRight, Leaf, Sparkles, Star } from "lucide-react";
import { ProductCard } from "./_components/product-card";
import { StorefrontFrame } from "./_components/storefront-frame";
import { getCatalogContext, getPublishedProducts } from "./_lib/catalog";

const homepageStats = [
  { label: "Crafted in small batches", value: "100% handmade" },
  { label: "Core launch categories", value: "8 collections" },
  { label: "Story-led storefront", value: "Live catalog now connected" },
];

export default async function Page() {
  const [{ categories }, featuredProducts] = await Promise.all([
    getCatalogContext(),
    getPublishedProducts({ sort: "featured", limit: 4 }),
  ]);
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return (
    <StorefrontFrame currentPath="/">
      <div className="flex flex-col gap-10">
        <section className="grid gap-8 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-bonita-moss)]">
              Artistic commerce
            </p>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-6xl leading-none text-[var(--color-bonita-charcoal)] md:text-8xl">
                Jewelry that feels like collected art, not inventory.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_76%,white)] md:text-lg">
                Browse handcrafted jewelry shaped by calm color, small-batch making,
                and the kind of story that turns an accessory into something personal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button>Explore collection</Button>
              </Link>
              <Link href="/shop?sort=featured">
                <Button variant="secondary">View featured pieces</Button>
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {homepageStats.map((item) => (
                <StatChip key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <Surface className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(127,143,120,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(211,180,167,0.22),transparent_32%)]" />
            <div className="relative space-y-8">
              <div className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-clay)]">
                Calm, natural, expressive
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
                  Experience pillars
                </p>
                <div className="space-y-4 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_76%,white)]">
                  <div className="flex items-start gap-3">
                    <Leaf className="mt-1 size-4 text-[var(--color-bonita-moss)]" />
                    <p>Story-first product pages shaped around handmade work and mindful materials.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 size-4 text-[var(--color-bonita-clay)]" />
                    <p>Editorial browsing flow designed for an Instagram-origin audience moving into owned commerce.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="mt-1 size-4 text-[var(--color-bonita-cocoa)]" />
                    <p>Published products now flow directly from the admin catalog into the storefront.</p>
                  </div>
                </div>
              </div>
            </div>
          </Surface>
        </section>

        <section className="mt-10">
          <SectionHeading
            eyebrow="Launch categories"
            title="A structured catalog ready for discovery, gifting, and storytelling."
            description="Each category is now a live browsing route backed by your admin-managed catalog, so the storefront and admin already share the same source of truth."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <Link href={`/category/${category.slug}`} key={category.id}>
                <Surface className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/78">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-moss)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-charcoal)]">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                    Browse the live {category.name.toLowerCase()} collection and move from
                    category discovery into product detail storytelling.
                  </p>
                </Surface>
              </Link>
            ))}
          </div>
        </section>

        {featuredProducts.length ? (
          <section className="space-y-6">
            <SectionHeading
              eyebrow="Featured products"
              title="Published pieces already flowing through the storefront."
              description="This section uses your real admin-managed product data, which means the storefront and admin are now working against the same catalog source."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  categoryName={categoryMap.get(product.categoryId)?.name ?? "Collection"}
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 pb-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Surface className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
              Brand mission
            </p>
            <p className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-bonita-charcoal)]">
              {brand.mission}
            </p>
          </Surface>
          <Surface className="p-8">
            <SectionHeading
              eyebrow="Current delivery"
              title="The storefront now moves from mood and category discovery into real product pages."
              description="This gives us the right base for the next commerce layers: cart, checkout, payment intent, and order management."
              action={
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-bonita-cocoa)]"
                  href="/shop"
                >
                  Browse catalog
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </Surface>
        </section>
      </div>
    </StorefrontFrame>
  );
}
