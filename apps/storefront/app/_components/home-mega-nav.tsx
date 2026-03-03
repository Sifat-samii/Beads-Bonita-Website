"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  Star,
  User,
  X,
} from "lucide-react";

export type HomeNavProduct = {
  id: string;
  name: string;
  href: string;
  imageUrl: string | null;
  price: string;
};

export type HomeNavSubcategory = {
  label: string;
  href: string;
  products: HomeNavProduct[];
};

export type HomeNavItem = {
  label: string;
  href: string;
  description: string;
  subcategories: HomeNavSubcategory[];
  highlight: {
    title: string;
    body: string;
    href: string;
    imageUrl: string | null;
    badge: string;
  };
};

function NavIconButton({
  children,
  className,
  href,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  href?: string;
  onClick?: () => void;
}) {
  const classes = `inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function DesktopNavLinks({
  items,
  activeIndex,
  navLinkClass,
  onActivate,
}: {
  items: HomeNavItem[];
  activeIndex: number | null;
  navLinkClass: string;
  onActivate: (index: number) => void;
}) {
  return (
    <>
      {items.map((item, index) => (
        <div key={item.label} onMouseEnter={() => onActivate(index)}>
          <Link
            className={`inline-flex min-h-10 items-center border-b pb-2 transition ${
              activeIndex === index
                ? "border-[var(--color-bonita-charcoal)] text-[var(--color-bonita-charcoal)]"
                : `border-transparent ${navLinkClass}`
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </>
  );
}

function ExpansionPanel({
  activeItem,
  activeSubcategory,
  activeSubcategoryIndex,
  setActiveSubcategoryIndex,
}: {
  activeItem: HomeNavItem | null;
  activeSubcategory: HomeNavSubcategory | null;
  activeSubcategoryIndex: number;
  setActiveSubcategoryIndex: (index: number) => void;
}) {
  if (!activeItem) {
    return null;
  }

  return (
    <div className="w-full rounded-none border-x-0 border-black/6 bg-[rgba(250,247,242,0.97)] p-8 text-[var(--color-bonita-charcoal)] shadow-[0_30px_80px_rgba(23,18,12,0.16)] backdrop-blur-xl lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr_1.4fr]">
        <div>
          <p className="text-sm font-medium text-[color-mix(in_srgb,var(--color-bonita-charcoal)_52%,white)]">
            Subcategories
          </p>
          <div className="mt-5 space-y-2">
            {activeItem.subcategories.map((subcategory, index) => (
              <div key={subcategory.href} onMouseEnter={() => setActiveSubcategoryIndex(index)}>
                <Link
                  className={`flex items-center justify-between rounded-[1rem] px-4 py-3 text-base transition ${
                    activeSubcategoryIndex === index
                      ? "bg-[rgba(127,143,120,0.14)] text-[var(--color-bonita-charcoal)]"
                      : "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_78%,white)] hover:bg-white/70 hover:text-[var(--color-bonita-charcoal)]"
                  }`}
                  href={subcategory.href}
                >
                  <span>{subcategory.label}</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_42%,white)]">
                    {subcategory.products.length}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[color-mix(in_srgb,var(--color-bonita-charcoal)_52%,white)]">
            Highlight
          </p>
          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/65 bg-[linear-gradient(180deg,#edf4f0_0%,#dce8e0_40%,#f3eade_100%)]">
            <div className="relative aspect-[0.95]">
              {activeItem.highlight.imageUrl ? (
                <Image
                  alt={activeItem.highlight.title}
                  className="object-cover"
                  fill
                  sizes="360px"
                  src={activeItem.highlight.imageUrl}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),transparent_28%),linear-gradient(135deg,#1f6968_0%,#5dbeb8_42%,#d9f0ea_100%)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,22,21,0.04),rgba(14,22,21,0.34))]" />
              <div className="absolute left-5 top-5 rounded-full bg-white/78 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-charcoal)]">
                {activeItem.highlight.badge}
              </div>
            </div>
          </div>
          <p className="mt-5 text-xl font-semibold text-[var(--color-bonita-charcoal)]">
            {activeItem.highlight.title}
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            {activeItem.highlight.body}
          </p>
          <Link
            className="mt-4 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-bonita-charcoal)] transition hover:text-[var(--color-bonita-moss)]"
            href={activeItem.highlight.href}
          >
            View highlight
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[color-mix(in_srgb,var(--color-bonita-charcoal)_52%,white)]">
              {activeSubcategory?.label ?? "Products"}
            </p>
            {activeSubcategory ? (
              <Link
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-moss)] transition hover:text-[var(--color-bonita-charcoal)]"
                href={activeSubcategory.href}
              >
                Shop subcategory
              </Link>
            ) : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {activeSubcategory?.products.map((product) => (
              <Link
                className="group overflow-hidden rounded-[1.4rem] border border-white/68 bg-white/78 p-3 transition hover:-translate-y-1 hover:bg-white"
                href={product.href}
                key={product.id}
              >
                <div className="relative aspect-[1.02] overflow-hidden rounded-[1rem] bg-[linear-gradient(135deg,#edf4f0_0%,#dce8e0_40%,#f3eade_100%)]">
                  {product.imageUrl ? (
                    <Image
                      alt={product.name}
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      fill
                      sizes="220px"
                      src={product.imageUrl}
                    />
                  ) : null}
                </div>
                <div className="mt-4">
                  <p className="line-clamp-1 text-base font-semibold text-[var(--color-bonita-charcoal)]">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[var(--color-bonita-cocoa)]">
                      {product.price}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-moss)]">
                      <Star className="size-3" />
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeMegaNav({
  items,
  brandName,
  topOffsetClass = "top-0",
}: {
  items: HomeNavItem[];
  brandName: string;
  topOffsetClass?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSubcategoryIndex, setActiveSubcategoryIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeItem = useMemo(
    () => (activeIndex == null ? null : items[activeIndex] ?? null),
    [activeIndex, items],
  );

  useEffect(() => {
    setActiveSubcategoryIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeSubcategory =
    activeItem?.subcategories[
      Math.min(activeSubcategoryIndex, (activeItem?.subcategories.length ?? 1) - 1)
    ] ?? null;

  const navIsActive = navHovered || activeItem != null || mobileOpen || isScrolled;
  const chromeClass = navIsActive
    ? "border-black/6 bg-[rgba(250,247,242,0.94)] text-[var(--color-bonita-charcoal)] shadow-[0_24px_60px_rgba(24,18,12,0.12)] backdrop-blur-xl"
    : "border-white/14 bg-white/8 text-white shadow-none backdrop-blur-md";
  const iconClass = navIsActive
    ? "border-black/8 bg-white/72 text-[var(--color-bonita-charcoal)] hover:bg-white"
    : "border-white/15 bg-white/8 text-white hover:bg-white/14";
  const navLinkClass = navIsActive
    ? "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_82%,white)] hover:text-[var(--color-bonita-charcoal)]"
    : "text-white/92 hover:text-white";
  const shellClass = `${isScrolled ? "fixed top-0" : `absolute ${topOffsetClass}`} inset-x-0 z-30`;
  const shellPaddingClass = isScrolled ? "py-2" : "py-3";
  const brandWrapClass = isScrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100";
  const navMarginClass = isScrolled ? "mt-0.5" : "mt-3";

  const resetHoverState = () => {
    setNavHovered(false);
    setActiveIndex(null);
  };

  return (
    <header
      className={shellClass}
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={resetHoverState}
    >
      <div className="px-0 pt-0">
        <div
          className={`rounded-none border-x-0 px-5 transition duration-300 sm:px-8 lg:px-10 ${chromeClass} ${shellPaddingClass}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <NavIconButton className={iconClass}>
                <Search className="size-4" />
              </NavIconButton>
              <NavIconButton className={iconClass}>
                <MapPin className="size-4" />
              </NavIconButton>
            </div>

            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition sm:hidden ${iconClass}`}
              onClick={() => setMobileOpen((value) => !value)}
              type="button"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            <div className="flex-1 px-4 text-center sm:px-8">
              <div className="flex flex-col items-center justify-center">
                <div className={`overflow-hidden transition-all duration-300 ${brandWrapClass}`}>
                  <Link href="/">
                    <p
                      className={`font-[family-name:var(--font-body)] text-[1.9rem] font-semibold uppercase leading-none tracking-[0.24em] transition sm:text-[2.5rem] lg:text-[3.1rem] ${
                        navIsActive ? "text-[var(--color-bonita-charcoal)]" : "text-white"
                      }`}
                    >
                      {brandName}
                    </p>
                  </Link>
                </div>

                <nav
                  className={`hidden items-center justify-center gap-6 text-[13px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 lg:flex ${navMarginClass}`}
                >
                  <DesktopNavLinks
                    activeIndex={activeIndex}
                    items={items}
                    navLinkClass={navLinkClass}
                    onActivate={setActiveIndex}
                  />
                </nav>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <NavIconButton className={iconClass} href="/account">
                <User className="size-4" />
              </NavIconButton>
              <NavIconButton className={iconClass}>
                <Heart className="size-4" />
              </NavIconButton>
              <NavIconButton className={iconClass} href="/cart">
                <ShoppingBag className="size-4" />
              </NavIconButton>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`hidden px-10 pt-0 transition duration-300 lg:block ${
          activeItem
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ExpansionPanel
          activeItem={activeItem}
          activeSubcategory={activeSubcategory}
          activeSubcategoryIndex={activeSubcategoryIndex}
          setActiveSubcategoryIndex={setActiveSubcategoryIndex}
        />
      </div>

      {mobileOpen ? (
        <div className="px-4 pt-4 lg:hidden">
          <div className="rounded-[1.75rem] border border-white/12 bg-[rgba(14,24,23,0.84)] p-5 text-white shadow-[0_20px_50px_rgba(7,10,10,0.22)] backdrop-blur-xl">
            <div className="space-y-5">
              {items.map((item) => (
                <div className="border-b border-white/10 pb-4" key={item.label}>
                  <Link
                    className="text-base font-semibold uppercase tracking-[0.14em]"
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/72">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}






