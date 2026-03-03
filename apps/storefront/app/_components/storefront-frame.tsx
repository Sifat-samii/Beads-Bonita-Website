import Link from "next/link";
import { brand, storefrontNavigation } from "@beads-bonita/core";
import { Button } from "@beads-bonita/ui/button";
import { Surface } from "@beads-bonita/ui/surface";
import { CartLink } from "./cart-link";

type NavItem = {
  label: string;
  href: string;
};

function isActiveLink(href: string, currentPath: string) {
  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function StorefrontFrame({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    ...storefrontNavigation.filter((item) =>
      ["/shop", "/custom-orders", "/sustainability", "/testimonials"].includes(item.href),
    ),
  ];

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto flex w-full max-w-none flex-col gap-8 px-6 py-6 md:px-10">
        <header className="sticky top-4 z-20">
          <Surface className="border-white/50 bg-white/65 px-5 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Link href="/">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-bonita-moss)]">
                    {brand.name}
                  </p>
                  <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
                    {brand.tagline}
                  </p>
                </Link>
              </div>
              <nav className="flex flex-wrap items-center gap-2 text-sm">
                {navItems.map((item) => (
                  <Link
                    className={`rounded-full px-4 py-2 transition ${
                      isActiveLink(item.href, currentPath)
                        ? "bg-[var(--color-bonita-charcoal)] text-[var(--color-bonita-ivory)]"
                        : "text-[var(--color-bonita-charcoal)] hover:bg-white/55"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <CartLink />
                <Link href="/account">
                  <Button className="!px-4 !py-2" variant="secondary">
                    Account
                  </Button>
                </Link>
              </div>
            </div>
          </Surface>
        </header>

        {children}

        <footer className="pb-10">
          <Surface className="border-white/40 bg-white/60 p-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
                  {brand.name}
                </p>
                <p className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl leading-tight text-[var(--color-bonita-charcoal)]">
                  Calm handmade jewelry with story, intention, and everyday warmth.
                </p>
              </div>
              <div className="grid gap-2 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                <Link href="/shop">Shop all products</Link>
                <Link href="/custom-orders">Custom orders</Link>
                <Link href="/sustainability">Sustainability story</Link>
                <Link href="/testimonials">Customer testimonials</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/account">Account</Link>
              </div>
            </div>
          </Surface>
        </footer>
      </div>
    </main>
  );
}


