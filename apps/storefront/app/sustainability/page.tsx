import { Leaf, PackageCheck, Recycle } from "lucide-react";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";
import { StorefrontPageHero } from "../_components/storefront-page-hero";

const principles = [
  {
    title: "Mindful materials",
    body: "This page is intended to explain how materials, sourcing choices, and product care align with the brand.",
    icon: Leaf,
  },
  {
    title: "Small-batch thinking",
    body: "Bonita’s storefront and catalog structure already support a more intentional, limited-volume product narrative.",
    icon: PackageCheck,
  },
  {
    title: "Longer product life",
    body: "Care and sustainability messaging will ultimately connect product detail content with a broader brand commitment.",
    icon: Recycle,
  },
];

export default function SustainabilityPage() {
  return (
    <StorefrontFrame currentPath="/sustainability">
      <StorefrontPageHero
        accent="This page now feels intentional even before the full sustainability narrative is written."
        description="The site plan calls for a dedicated story around materials, mindful making, and why supporting the brand matters. The route is ready; the long-form content is the next layer."
        eyebrow="Sustainability"
        primaryCta={{ href: "/shop", label: "Shop the collection" }}
        secondaryCta={{ href: "/custom-orders", label: "Custom journey" }}
        title="A calmer, trust-building page for the brand’s making philosophy."
      />

      <section className="grid gap-5 md:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <Surface
              className="rounded-[2rem] border-white/65 bg-[linear-gradient(180deg,rgba(237,244,240,0.82),rgba(255,255,255,0.86))] p-7"
              key={principle.title}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/82 text-[var(--color-bonita-moss)]">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em] text-[var(--color-bonita-charcoal)]">
                {principle.title}
              </h2>
              <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                {principle.body}
              </p>
            </Surface>
          );
        })}
      </section>
    </StorefrontFrame>
  );
}
