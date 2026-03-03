import Link from "next/link";
import { brand } from "@beads-bonita/core";

export function StorefrontFooter() {
  return (
    <footer className="w-full">
      <div className="border-t border-black/8 bg-[#f7f5f2]">
        <div className="grid gap-10 px-8 py-10 sm:px-10 lg:grid-cols-[1fr_1fr_1fr_1.15fr] lg:px-16 lg:py-12">
          <div className="space-y-7">
            <p className="text-base leading-8 text-[var(--color-bonita-charcoal)]">
              You can{" "}
              <a className="underline underline-offset-4" href="mailto:hello@beadsbonita.com">
                email us
              </a>
              .
            </p>
            <div className="grid gap-6 text-[1.05rem] text-[var(--color-bonita-charcoal)]">
              <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/cart">
                Cart
              </Link>
              <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/account">
                My account
              </Link>
              <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/shop">
                Shop all products
              </Link>
              <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/custom-orders">
                Custom orders
              </Link>
            </div>
          </div>

          <div className="grid gap-6 text-[1.05rem] text-[var(--color-bonita-charcoal)]">
            <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/sustainability">
              Sustainability
            </Link>
            <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/testimonials">
              Testimonials
            </Link>
            <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/login">
              Sign in
            </Link>
            <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/register">
              Create account
            </Link>
            <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/">
              Home
            </Link>
          </div>

          <div className="grid gap-6 text-[1.05rem] text-[var(--color-bonita-charcoal)]">
            <p>Gift-ready packaging</p>
            <p>Handmade craftsmanship</p>
            <p>Bonita collections</p>
            <p>Latest arrivals</p>
            <p>Ethical making</p>
            <p>Studio updates</p>
          </div>

          <div>
            <p className="max-w-md text-[1.05rem] leading-9 text-[var(--color-bonita-charcoal)]">
              Sign up for Bonita emails and receive the latest notes from the studio,
              including featured product launches, collection highlights, and new arrivals.
            </p>
            <div className="mt-8">
              <p className="text-[1.05rem] text-[var(--color-bonita-charcoal)]">Follow Us</p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/8 px-8 py-8 sm:px-10 lg:px-16 lg:py-10">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="flex items-center gap-3 text-[1rem] text-[var(--color-bonita-charcoal)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/20 text-[11px]">
                O
              </span>
              <a className="underline underline-offset-4" href="#">
                International (English)
              </a>
            </div>

            <div className="text-center">
              <p className="text-[2rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-bonita-charcoal)] sm:text-[2.3rem]">
                {brand.name}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[1rem] text-[var(--color-bonita-charcoal)] lg:justify-end">
              <Link className="transition hover:text-[var(--color-bonita-moss)]" href="/shop">
                Sitemap
              </Link>
              <a className="transition hover:text-[var(--color-bonita-moss)]" href="#">
                Legal & privacy
              </a>
              <a className="transition hover:text-[var(--color-bonita-moss)]" href="#">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
