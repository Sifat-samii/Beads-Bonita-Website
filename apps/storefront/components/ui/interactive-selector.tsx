"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type InteractiveSelectorOption = {
  id: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string | null;
};

export default function InteractiveSelector({
  options,
}: {
  options: InteractiveSelectorOption[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  const optionCount = options.length;
  const optionSignature = useMemo(
    () => options.map((option) => option.id).join(":"),
    [options],
  );

  useEffect(() => {
    if (!optionCount) {
      return;
    }

    setAnimatedOptions([]);
    setActiveIndex(0);

    const timers = Array.from({ length: optionCount }, (_, index) =>
      window.setTimeout(() => {
        setAnimatedOptions((previous) =>
          previous.includes(index) ? previous : [...previous, index],
        );
      }, 140 * index),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [optionCount, optionSignature]);

  if (!optionCount) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-h-[26rem] min-w-[840px] items-stretch gap-3 lg:min-w-0 lg:gap-4">
        {options.map((option, index) => {
          const isActive = activeIndex === index;

          return (
            <Link
              className="relative flex min-h-[26rem] min-w-[4.75rem] flex-col justify-end overflow-hidden border border-white/30 bg-[#d9dfda] transition-[flex,transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              href={option.href}
              key={option.id}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              style={{
                flex: isActive ? "6.8 1 0%" : "1 1 0%",
                opacity: animatedOptions.includes(index) ? 1 : 0,
                transform: animatedOptions.includes(index)
                  ? "translateX(0)"
                  : "translateX(-40px)",
                boxShadow: isActive
                  ? "0 24px 48px rgba(24, 18, 14, 0.14)"
                  : "0 10px 24px rgba(24, 18, 14, 0.08)",
                zIndex: isActive ? 2 : 1,
              }}
            >
              {option.imageUrl ? (
                <Image
                  alt={option.title}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  fill
                  sizes="(max-width: 1024px) 60vw, 28vw"
                  src={option.imageUrl}
                  style={{
                    transform: isActive ? "scale(1.02)" : "scale(1.12)",
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_28%),linear-gradient(135deg,#e1efe6_0%,#c5ddd5_45%,#f4ece1_100%)]" />
              )}

              <div
                className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  background: isActive
                    ? "linear-gradient(180deg, rgba(10,16,16,0.06) 0%, rgba(10,16,16,0.12) 38%, rgba(10,16,16,0.6) 100%)"
                    : "linear-gradient(180deg, rgba(10,16,16,0.02) 0%, rgba(10,16,16,0.08) 58%, rgba(10,16,16,0.34) 100%)",
                }}
              />

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  height: isActive ? "11rem" : "8rem",
                  boxShadow: isActive
                    ? "inset 0 -160px 120px -88px rgba(0,0,0,0.95)"
                    : "inset 0 -120px 90px -90px rgba(0,0,0,0.82)",
                }}
              />

              <div className="absolute bottom-7 left-6 right-6 sm:bottom-8 sm:left-7 sm:right-7">
                <p
                  className="max-w-[18rem] text-[1.04rem] font-semibold uppercase leading-[1.15] tracking-[0.2em] text-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[1.12rem]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translate3d(0,0,0)" : "translate3d(22px,0,0)",
                  }}
                >
                  {option.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
