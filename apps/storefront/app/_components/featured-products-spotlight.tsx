"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StoreProductCard } from "../_lib/catalog";
import { useLoopingCarousel } from "./use-looping-carousel";

export function FeaturedProductsSpotlight({
  products,
}: {
  products: StoreProductCard[];
}) {
  const {
    activeIndex,
    handleTransitionEnd,
    loopedIndexes,
    setAutoplayPaused,
    trackIndex,
    transitionEnabled,
    goTo,
    goToNext,
    goToPrevious,
  } = useLoopingCarousel({
    itemCount: products.length,
    visibleCount: 1,
    autoplayMs: 2500,
  });

  if (!products.length) {
    return null;
  }

  useEffect(() => {
    setAutoplayPaused(false);
  }, [setAutoplayPaused]);

  return (
    <section className="bg-[#f7f5f2] px-6 py-16 sm:px-10 lg:px-16 lg:py-22">
      <div className="mx-auto max-w-[1540px]">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
            Featured products
          </p>
        </div>

        <div className="relative mx-auto max-w-[1120px]">
          <button
            aria-label="Previous featured product"
            className="absolute left-0 top-[28%] z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--color-bonita-charcoal)] transition hover:cursor-pointer hover:opacity-60"
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            aria-label="Next featured product"
            className="absolute right-0 top-[28%] z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--color-bonita-charcoal)] transition hover:cursor-pointer hover:opacity-60"
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="overflow-hidden">
            <div
              className={`flex ${transitionEnabled ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}`}
              onTransitionEnd={handleTransitionEnd}
              style={{ transform: `translateX(-${trackIndex * 100}%)` }}
            >
              {loopedIndexes.map((productIndex, index) => {
                const product = products[productIndex]!;
                const eager = index <= 1;

                return (
                <div className="w-full shrink-0" key={`${product.id}-${index}`}>
                  <div className="overflow-hidden rounded-none bg-[#f2eee8]">
                    <div className="relative aspect-[1.85] w-full overflow-hidden bg-[linear-gradient(135deg,#d0c1aa_0%,#b69463_26%,#d5c8b2_58%,#6d5227_82%,#e4dcc6_100%)]">
                      {product.primaryImageUrl ? (
                        <div className="absolute inset-0">
                          <Image
                            alt={product.name}
                            className="object-cover"
                            fill
                            loading={eager ? "eager" : "lazy"}
                            priority={eager}
                            sizes="(max-width: 1280px) 100vw, 1120px"
                            src={product.primaryImageUrl}
                          />
                        </div>
                      ) : null}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]" />
                    </div>
                  </div>

                  <div className="mx-auto max-w-[860px] px-6 pb-16 pt-10 text-center sm:px-10">
                    <h3 className="font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-[var(--color-bonita-charcoal)] sm:text-5xl">
                      {product.name}
                    </h3>
                    <p className="mx-auto mt-6 max-w-4xl text-lg leading-10 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_78%,white)] sm:text-[1.45rem]">
                      {product.shortDescription}
                    </p>
                    <div className="mt-8">
                      <Link
                        className="inline-flex min-h-14 items-center justify-center border border-black/20 bg-transparent px-10 text-base font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)] transition hover:bg-white/55"
                        href={`/product/${product.slug}`}
                      >
                        Shop now
                      </Link>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {products.length > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              {products.map((product, index) => (
                <button
                  aria-label={`Go to featured product ${index + 1}`}
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
      </div>
    </section>
  );
}
