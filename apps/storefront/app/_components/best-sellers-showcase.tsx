"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StoreProductCard } from "../_lib/catalog";
import { useLoopingCarousel } from "./use-looping-carousel";

function getItemsPerPage(width: number) {
  if (width < 640) {
    return 1;
  }

  if (width < 1100) {
    return 2;
  }

  return 4;
}

export function BestSellersShowcase({
  products,
}: {
  products: StoreProductCard[];
}) {
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const syncItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth));
    };

    syncItemsPerPage();
    window.addEventListener("resize", syncItemsPerPage);

    return () => window.removeEventListener("resize", syncItemsPerPage);
  }, []);
  const {
    activeIndex,
    canLoop,
    handleTransitionEnd,
    loopPadding,
    loopedIndexes,
    trackIndex,
    transitionEnabled,
    goTo,
    goToNext,
    goToPrevious,
  } = useLoopingCarousel({
    itemCount: products.length,
    visibleCount: itemsPerPage,
  });

  if (!products.length) {
    return null;
  }

  return (
    <section className="bg-[#f7f5f2] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1720px]">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-[#f7f5f2] sm:w-14 xl:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-[#f7f5f2] sm:w-14 xl:w-16" />

          <button
            aria-label="Previous best sellers"
            className="absolute left-0 top-[34%] z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--color-bonita-charcoal)] transition hover:cursor-pointer hover:opacity-60 disabled:opacity-25"
            disabled={!canLoop}
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="overflow-hidden px-8 sm:px-14 xl:px-16">
            <div
              className={`flex gap-8 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                transitionEnabled ? "transition-transform duration-500" : ""
              }`}
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(calc(-${trackIndex} * ((100% - ${
                  (itemsPerPage - 1) * 2
                }rem) / ${itemsPerPage} + 2rem)))`,
              }}
            >
              {loopedIndexes.map((productIndex, index) => {
                const product = products[productIndex]!;

                return (
                <Link
                  className="group flex shrink-0 flex-col items-center"
                  href={`/product/${product.slug}`}
                  key={`${product.id}-${index}`}
                  style={{
                    width: `calc(${100 / itemsPerPage}% - ${
                      ((itemsPerPage - 1) * 2) / itemsPerPage
                    }rem)`,
                  }}
                >
                  <div className="relative flex min-h-[23rem] w-full items-center justify-center px-2 py-3 sm:min-h-[27rem] xl:min-h-[29rem]">
                    <div className="absolute inset-x-[24%] bottom-8 h-5 rounded-full bg-black/[0.07] blur-xl sm:bottom-10" />
                    {product.primaryImageUrl ? (
                      <Image
                        alt={product.name}
                        className="relative h-auto max-h-[20rem] w-auto max-w-full object-contain transition duration-500 group-hover:scale-[1.03] sm:max-h-[24rem] xl:max-h-[25rem]"
                        height={560}
                        src={product.primaryImageUrl}
                        width={560}
                      />
                    ) : (
                      <div className="h-72 w-full max-w-[19rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_35%),linear-gradient(135deg,#f6f6f4_0%,#eceae5_45%,#faf8f4_100%)]" />
                    )}
                  </div>
                  <div className="max-w-[19rem] px-2 pt-3 text-center">
                    <h3 className="font-[family-name:var(--font-display)] text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-[var(--color-bonita-charcoal)] xl:text-[1.75rem]">
                      {product.name}
                    </h3>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>

          <button
            aria-label="Next best sellers"
            className="absolute right-0 top-[34%] z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--color-bonita-charcoal)] transition hover:cursor-pointer hover:opacity-60 disabled:opacity-25"
            disabled={!canLoop}
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {products.length > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            {products.map((product, index) => (
              <button
                aria-label={`Go to best seller ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? "bg-[var(--color-bonita-cocoa)]" : "bg-black/12"
                }`}
                key={product.id}
                onClick={() => goTo(index)}
                type="button"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
