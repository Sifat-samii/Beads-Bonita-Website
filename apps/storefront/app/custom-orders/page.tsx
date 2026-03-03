import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";
import { StorefrontPageHero } from "../_components/storefront-page-hero";

const pillars = [
  "Made-for-you request intake",
  "Reference upload and visual guidance",
  "Admin review and response workflow",
  "Quote and lead-time confirmation",
];

export default function CustomOrdersPage() {
  return (
    <StorefrontFrame currentPath="/custom-orders">
      <StorefrontPageHero
        accent="This route is already in place so the bespoke flow can land without changing the storefront structure later."
        description="The dedicated custom-order workflow is planned after the core storefront and checkout path. For now, this page carries the right tone and reserves the customer journey entry point."
        eyebrow="Custom orders"
        primaryCta={{ href: "/shop", label: "Browse current catalog" }}
        secondaryCta={{ href: "/account", label: "Member account" }}
        title="A bespoke request experience is already mapped into the brand."
      />

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="rounded-[2rem] border-white/65 bg-[linear-gradient(180deg,rgba(237,244,240,0.84),rgba(244,236,225,0.9))] p-7">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/82 text-[var(--color-bonita-moss)]">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
                What is planned
              </p>
              <div className="mt-5 space-y-3">
                {pillars.map((item) => (
                  <p
                    className="rounded-[1.2rem] border border-white/55 bg-white/72 px-4 py-3 text-sm text-[var(--color-bonita-charcoal)]"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.82)] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Current state
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            The workflow is intentionally reserved while catalog, cart, checkout, and live
            admin publishing rules are being hardened. That keeps the brand story visible
            without pretending the request flow is complete before it is operational.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-cocoa)] transition hover:text-[var(--color-bonita-moss)]"
            href="/shop"
          >
            Explore current pieces
            <ArrowRight className="size-4" />
          </Link>
        </Surface>
      </section>
    </StorefrontFrame>
  );
}
