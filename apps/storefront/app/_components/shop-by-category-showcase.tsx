"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLoopingCarousel } from "./use-looping-carousel";

type CategoryShowcaseItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

function getItemsPerPage(width: number) {
  if (width < 640) {
    return 1;
  }

  if (width < 960) {
    return 2;
  }

  if (width < 1280) {
    return 3;
  }

  return 5;
}

export function ShopByCategoryShowcase({
  categories,
}: {
  categories: CategoryShowcaseItem[];
}) {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const {
    canLoop,
    handleTransitionEnd,
    loopedIndexes,
    trackIndex,
    transitionEnabled,
    goToNext,
    goToPrevious,
  } = useLoopingCarousel({
    itemCount: categories.length,
    visibleCount: itemsPerPage,
  });

  useEffect(() => {
    const syncItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth));
    };

    syncItemsPerPage();
    window.addEventListener("resize", syncItemsPerPage);

    return () => window.removeEventListener("resize", syncItemsPerPage);
  }, []);

  if (!categories.length) {
    return null;
  }

  return (
    <section className="bg-[#f7f5f2] px-6 pb-24 pt-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
            Shop by Category
          </p>
        </div>

        <div className="relative">
          <button
            aria-label="Previous categories"
            className="absolute left-0 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--color-bonita-charcoal)] transition hover:cursor-pointer hover:opacity-60 disabled:opacity-25"
            disabled={!canLoop}
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="overflow-hidden px-8 sm:px-12 xl:px-14">
            <div
              className={`flex gap-1 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                transitionEnabled ? "transition-transform duration-500" : ""
              }`}
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(calc(-${trackIndex} * ((100% - ${
                  (itemsPerPage - 1) * 0.25
                }rem) / ${itemsPerPage} + 0.25rem)))`,
              }}
            >
              {loopedIndexes.map((categoryIndex, index) => {
                const category = categories[categoryIndex]!;

                return (
                  <Link
                    className="group relative mx-auto w-[76%] overflow-hidden border border-white/30 bg-[rgba(255,255,255,0.24)] transition duration-300 hover:-translate-y-1"
                    href={`/category/${category.slug}`}
                    key={`${category.id}-${index}`}
                    style={{
                      width: `calc(${100 / itemsPerPage}% - ${
                        ((itemsPerPage - 1) * 0.25) / itemsPerPage
                      }rem)`,
                    }}
                  >
                    <div className="relative min-h-[26rem]">
                      {category.imageUrl ? (
                        <Image
                          alt={category.name}
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                          fill
                          sizes="(max-width: 1280px) 100vw, 20vw"
                          src={category.imageUrl}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_30%),linear-gradient(135deg,#dff1ea_0%,#b7e5df_42%,#f4ece1_100%)]" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,16,0.02)_0%,rgba(10,16,16,0.08)_38%,rgba(10,16,16,0.5)_100%)]" />
                      <div className="pointer-events-none absolute inset-x-3 bottom-3 border border-white/35 bg-[rgba(255,255,255,0.18)] px-4 py-4 opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
                        <h3 className="font-[family-name:var(--font-display)] text-3xl leading-none text-white">
                          {category.name}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/95">
                          Explore
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            aria-label="Next categories"
            className="absolute right-0 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--color-bonita-charcoal)] transition hover:cursor-pointer hover:opacity-60 disabled:opacity-25"
            disabled={!canLoop}
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
