import { brand, productCategories, storefrontNavigation } from "@beads-bonita/core";
import { Button } from "@beads-bonita/ui/button";
import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { StatChip } from "@beads-bonita/ui/stat-chip";
import { Surface } from "@beads-bonita/ui/surface";
import { ArrowRight, Leaf, Sparkles, Star } from "lucide-react";

const homepageStats = [
  { label: "Crafted in small batches", value: "100% handmade" },
  { label: "Core launch categories", value: "8 collections" },
  { label: "Planned testimonials flow", value: "Moderated social proof" },
];

export default function Page() {
  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-6 md:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/50 bg-white/60 px-5 py-4 backdrop-blur-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-bonita-moss)]">
              {brand.name}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
              Handcrafted jewelry for thoughtful everyday adornment.
            </p>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {storefrontNavigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <section className="grid gap-8 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-bonita-moss)]">
              Artistic commerce foundation
            </p>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-6xl leading-none text-[var(--color-bonita-charcoal)] md:text-8xl">
                Jewelry that feels like collected art, not inventory.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_76%,white)] md:text-lg">
                This first implementation slice establishes the storefront shell,
                design language, shared monorepo packages, and Supabase-first
                architecture for BEADS BONITA.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Explore foundation</Button>
              <Button variant="secondary">View roadmap</Button>
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
                    <p>Sustainability storytelling built into navigation and PDP structure.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 size-4 text-[var(--color-bonita-clay)]" />
                    <p>Editorial, premium UI system designed for an Instagram-origin audience.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="mt-1 size-4 text-[var(--color-bonita-cocoa)]" />
                    <p>Admin-ready architecture for products, inventory, orders, and testimonials.</p>
                  </div>
                </div>
              </div>
            </div>
          </Surface>
        </section>

        <section className="mt-10">
          <SectionHeading
            eyebrow="Launch categories"
            title="A structured catalog ready for discovery, merchandising, and growth."
            description="The data model and navigation are being shaped around your core handcrafted jewelry categories, with dynamic subcategories and future-ready merchandising tags."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category, index) => (
              <Surface className="p-6" key={category}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-moss)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-charcoal)]">
                  {category}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                  Dynamic category support will allow admin-managed subcategories,
                  storytelling, and collection curation.
                </p>
              </Surface>
            ))}
          </div>
        </section>

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
              title="The repo now reflects the approved architecture instead of a starter template."
              description="This foundation includes shared packages, initial Supabase schema scaffolding, RLS documentation, branded app shells, and the first project-wide standards."
              action={
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-bonita-cocoa)]"
                  href="/docs"
                >
                  Documentation path
                  <ArrowRight className="size-4" />
                </a>
              }
            />
          </Surface>
        </section>
      </div>
    </main>
  );
}
