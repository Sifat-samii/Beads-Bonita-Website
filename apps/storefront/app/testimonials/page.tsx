import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";

export default function TestimonialsPage() {
  return (
    <StorefrontFrame currentPath="/testimonials">
      <section className="space-y-6 pt-4 pb-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Moderated customer stories are planned as the next trust-building content layer."
          description="The storefront route is ready, and the admin moderation workflow already exists in the master plan direction."
        />
        <Surface className="border-white/40 bg-white/60 p-8">
          <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            Once testimonial submission and approval are connected to the storefront,
            this page will surface customer quotes, imagery, and product-linked social
            proof.
          </p>
        </Surface>
      </section>
    </StorefrontFrame>
  );
}
