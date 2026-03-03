import { MessageSquareQuote, ShieldCheck, Sparkles } from "lucide-react";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";
import { StorefrontPageHero } from "../_components/storefront-page-hero";

const cards = [
  {
    title: "Submission flow",
    body: "Customers will be able to submit product-linked testimonials from the account experience.",
    icon: MessageSquareQuote,
  },
  {
    title: "Moderation first",
    body: "Testimonials are planned to remain curated and approved before appearing publicly.",
    icon: ShieldCheck,
  },
  {
    title: "Trust layer",
    body: "This page will become a stronger social-proof surface once review and moderation are connected.",
    icon: Sparkles,
  },
];

export default function TestimonialsPage() {
  return (
    <StorefrontFrame currentPath="/testimonials">
      <StorefrontPageHero
        accent="The route already exists so trust-building content can be introduced without changing storefront structure later."
        description="Testimonials are planned as the next social-proof layer. The visual shell is ready now; the customer submission and moderation workflow is the missing product slice."
        eyebrow="Testimonials"
        primaryCta={{ href: "/shop", label: "Browse products" }}
        secondaryCta={{ href: "/account", label: "Member account" }}
        title="A moderated customer-story page reserved for the next trust layer."
      />

      <section className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Surface
              className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.82)] p-7"
              key={card.title}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(237,244,240,0.88)] text-[var(--color-bonita-moss)]">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em] text-[var(--color-bonita-charcoal)]">
                {card.title}
              </h2>
              <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                {card.body}
              </p>
            </Surface>
          );
        })}
      </section>
    </StorefrontFrame>
  );
}
