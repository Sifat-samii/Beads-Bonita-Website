import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StorefrontPageHero({
  eyebrow,
  title,
  description,
  accent,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(237,244,240,0.72)_42%,rgba(244,236,225,0.84)_100%)] px-7 py-8 shadow-[0_24px_70px_rgba(34,27,20,0.08)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(157,203,193,0.18),transparent_68%)] blur-2xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(211,180,167,0.14),transparent_70%)] blur-2xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-bonita-moss)]">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-[0.95] tracking-[-0.04em] text-[var(--color-bonita-charcoal)] sm:text-5xl lg:text-[4.4rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)] sm:text-base">
            {description}
          </p>
        </div>

        <div className="space-y-6 lg:justify-self-end lg:text-right">
          {accent ? (
            <p className="max-w-md text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_64%,white)] lg:ml-auto">
              {accent}
            </p>
          ) : null}
          {(primaryCta || secondaryCta) ? (
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {primaryCta ? (
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-bonita-charcoal)] px-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-ivory)] transition hover:bg-[var(--color-bonita-moss)]"
                  href={primaryCta.href}
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/8 bg-white/70 px-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-charcoal)] transition hover:bg-white"
                  href={secondaryCta.href}
                >
                  {secondaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
