import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";

export default function SustainabilityPage() {
  return (
    <StorefrontFrame currentPath="/sustainability">
      <section className="space-y-6 pt-4 pb-8">
        <SectionHeading
          eyebrow="Sustainability"
          title="The sustainability story deserves its own calm, trust-building page."
          description="The master plan calls for a dedicated narrative around materials, mindful making, and why supporting this brand matters."
        />
        <Surface className="border-white/40 bg-white/60 p-8">
          <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            This reserved page keeps the site structure aligned with the long-term brand
            narrative while we focus first on catalog, PDP, cart, and checkout.
          </p>
        </Surface>
      </section>
    </StorefrontFrame>
  );
}
