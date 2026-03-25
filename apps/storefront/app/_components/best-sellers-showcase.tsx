"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { StoreProductCard } from "../_lib/catalog";

export function BestSellersShowcase({
  products,
}: {
  products: StoreProductCard[];
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sequenceRef = useRef<HTMLDivElement | null>(null);
  const animationStateRef = useRef({
    frameId: 0,
    animationStart: 0,
    baseOffset: 1,
    sequenceWidth: 1,
    isPaused: false,
  });
  const productSignature = useMemo(
    () => products.map((product) => product.id).join(":"),
    [products],
  );

  useEffect(() => {
    const trackNode = trackRef.current;
    const sequenceNode = sequenceRef.current;

    if (!trackNode || !sequenceNode || !products.length) {
      return;
    }

    const state = animationStateRef.current;

    const applyTransform = () => {
      trackNode.style.transform = `translate3d(${-state.baseOffset}px, 0, 0)`;
    };

    const syncWidth = () => {
      state.sequenceWidth = Math.max(sequenceNode.getBoundingClientRect().width, 1);
      if (state.baseOffset <= 1) {
        state.baseOffset = state.sequenceWidth;
      } else {
        state.baseOffset =
          ((state.baseOffset - state.sequenceWidth) % state.sequenceWidth +
            state.sequenceWidth) %
            state.sequenceWidth +
          state.sequenceWidth;
      }
      applyTransform();
    };

    const stopAnimation = () => {
      if (state.frameId) {
        window.cancelAnimationFrame(state.frameId);
        state.frameId = 0;
      }
    };

    const observer = new ResizeObserver(syncWidth);
    observer.observe(sequenceNode);
    syncWidth();

    const step = (timestamp: number) => {
      if (state.isPaused) {
        state.frameId = window.requestAnimationFrame(step);
        return;
      }

      if (!state.animationStart) {
        state.animationStart = timestamp;
      }

      const pixelsPerSecond = state.sequenceWidth / 18;
      const elapsedSeconds = (timestamp - state.animationStart) / 1000;
      const loopDistance = elapsedSeconds * pixelsPerSecond;
      state.baseOffset = (loopDistance % state.sequenceWidth) + state.sequenceWidth;
      applyTransform();
      state.frameId = window.requestAnimationFrame(step);
    };

    const handleVisibilityChange = () => {
      state.isPaused = document.hidden;
      state.animationStart = 0;
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = () => {
      state.isPaused = mediaQuery.matches || document.hidden;
      state.animationStart = 0;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    mediaQuery.addEventListener("change", handleMotionPreference);
    handleMotionPreference();
    state.frameId = window.requestAnimationFrame(step);

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mediaQuery.removeEventListener("change", handleMotionPreference);
      state.animationStart = 0;
    };
  }, [productSignature, products.length]);

  if (!products.length) {
    return null;
  }

  return (
    <section className="bg-[#f7f5f2] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
            Best seller
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-12 bg-[linear-gradient(90deg,rgba(247,245,242,1)_0%,rgba(247,245,242,0.86)_38%,rgba(247,245,242,0.38)_72%,rgba(247,245,242,0)_100%)] sm:w-16 xl:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-12 bg-[linear-gradient(270deg,rgba(247,245,242,1)_0%,rgba(247,245,242,0.86)_38%,rgba(247,245,242,0.38)_72%,rgba(247,245,242,0)_100%)] sm:w-16 xl:w-20" />

          <div className="overflow-hidden px-8 sm:px-14 xl:px-16">
            <div className="flex w-max will-change-transform" ref={trackRef}>
              {[0, 1, 2].map((sequenceIndex) => (
                <div
                  aria-hidden={sequenceIndex !== 1}
                  className="flex gap-8 xl:gap-10"
                  key={sequenceIndex}
                  ref={sequenceIndex === 1 ? sequenceRef : undefined}
                >
                  {products.map((product) => (
                    <Link
                      className="group flex w-[19.5rem] shrink-0 flex-col items-center sm:w-[22rem] xl:w-[23.5rem]"
                      href={`/product/${product.slug}`}
                      key={`${product.id}-${sequenceIndex}`}
                    >
                      <div className="relative flex h-[19.5rem] w-full items-center justify-center px-3 py-4 transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:h-[22.5rem] xl:h-[24rem]">
                        {product.primaryImageUrl ? (
                          <Image
                            alt={product.name}
                            className="relative h-auto max-h-[17.25rem] w-auto max-w-full object-contain drop-shadow-[0_12px_18px_rgba(24,18,14,0.12)] transition-transform duration-300 ease-out group-hover:scale-[1.015] sm:max-h-[20rem] xl:max-h-[21.5rem]"
                            height={560}
                            src={product.primaryImageUrl}
                            width={560}
                          />
                        ) : (
                          <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_35%),linear-gradient(135deg,#f6f6f4_0%,#eceae5_45%,#faf8f4_100%)]" />
                        )}
                      </div>
                      <div className="flex min-h-[6rem] w-full items-start justify-center px-3 pt-4 text-center">
                        <h3 className="font-[family-name:var(--font-display)] text-[1.42rem] leading-[1.08] tracking-[-0.03em] text-[var(--color-bonita-charcoal)] xl:text-[1.68rem]">
                          {product.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
