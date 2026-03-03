"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { HomeMegaNav, type HomeNavItem } from "./home-mega-nav";

type AnnouncementSlide = {
  id: string;
  label: string;
  href: string;
};

function HomeAnnouncementBar({
  slides,
  onVisibilityChange,
}: {
  slides: AnnouncementSlide[];
  onVisibilityChange: (visible: boolean) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    onVisibilityChange(!dismissed && slides.length > 0);
  }, [dismissed, onVisibilityChange, slides.length]);

  useEffect(() => {
    if (dismissed || slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [dismissed, slides.length]);

  const activeSlide = useMemo(() => slides[activeIndex] ?? null, [activeIndex, slides]);

  if (dismissed || !activeSlide) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-0 z-40 border-b border-white/10 bg-[rgba(107,78,58,0.72)] text-[var(--color-bonita-ivory)] backdrop-blur-md">
      <div className="flex min-h-9 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <button
          aria-label="Previous announcement"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/76 transition hover:bg-white/10 hover:text-white"
          onClick={() =>
            setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
          }
          type="button"
        >
          <ChevronLeft className="size-4" />
        </button>

        <Link
          className="truncate text-center text-[13px] tracking-[0.04em] text-white/92 underline-offset-4 transition hover:text-white hover:underline"
          href={activeSlide.href}
        >
          {activeSlide.label}
        </Link>

        <div className="flex items-center gap-1">
          {slides.length > 1 ? (
            <button
              aria-label="Next announcement"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/76 transition hover:bg-white/10 hover:text-white"
              onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          ) : null}
          <button
            aria-label="Dismiss announcement bar"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/76 transition hover:bg-white/10 hover:text-white"
            onClick={() => setDismissed(true)}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeTopChrome({
  brandName,
  items,
  slides,
}: {
  brandName: string;
  items: HomeNavItem[];
  slides: AnnouncementSlide[];
}) {
  const [bannerVisible, setBannerVisible] = useState(slides.length > 0);

  return (
    <>
      <HomeAnnouncementBar onVisibilityChange={setBannerVisible} slides={slides} />
      <HomeMegaNav
        brandName={brandName}
        items={items}
        topOffsetClass={bannerVisible ? "top-9" : "top-0"}
      />
    </>
  );
}

