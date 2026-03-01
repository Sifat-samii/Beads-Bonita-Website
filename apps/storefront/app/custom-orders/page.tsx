import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";

export default function CustomOrdersPage() {
  return (
    <StorefrontFrame currentPath="/custom-orders">
      <section className="space-y-6 pt-4 pb-8">
        <SectionHeading
          eyebrow="Custom orders"
          title="Bespoke pieces are part of the roadmap and the brand story."
          description="The dedicated custom-order workflow is planned after the core storefront and checkout flow. For now, this page reserves the right location in the customer journey."
        />
        <Surface className="border-white/40 bg-white/60 p-8">
          <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            This page will evolve into the made-for-you request experience with form
            submission, reference uploads, and admin review.
          </p>
        </Surface>
      </section>
    </StorefrontFrame>
  );
}
