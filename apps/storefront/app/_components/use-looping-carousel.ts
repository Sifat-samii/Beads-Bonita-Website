"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type UseLoopingCarouselInput = {
  itemCount: number;
  visibleCount?: number;
  autoplayMs?: number;
};

export function useLoopingCarousel({
  itemCount,
  visibleCount = 1,
  autoplayMs,
}: UseLoopingCarouselInput) {
  const canLoop = itemCount > visibleCount;
  const loopPadding = canLoop ? visibleCount : 0;
  const [trackIndex, setTrackIndex] = useState(loopPadding);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  useEffect(() => {
    setTransitionEnabled(false);
    setTrackIndex(canLoop ? loopPadding : 0);

    const frame = window.requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [canLoop, loopPadding]);

  useEffect(() => {
    if (!autoplayMs || !canLoop || autoplayPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setTrackIndex((current) => current + 1);
    }, autoplayMs);

    return () => window.clearInterval(interval);
  }, [autoplayMs, autoplayPaused, canLoop]);

  const activeIndex =
    itemCount === 0
      ? 0
      : canLoop
        ? ((trackIndex - loopPadding) % itemCount + itemCount) % itemCount
        : 0;

  const loopedIndexes = useMemo(() => {
    if (!canLoop) {
      return Array.from({ length: itemCount }, (_, index) => index);
    }

    const leading = Array.from({ length: loopPadding }, (_, index) => itemCount - loopPadding + index);
    const middle = Array.from({ length: itemCount }, (_, index) => index);
    const trailing = Array.from({ length: loopPadding }, (_, index) => index);

    return [...leading, ...middle, ...trailing];
  }, [canLoop, itemCount, loopPadding]);

  const handleTransitionEnd = useCallback(() => {
    if (!canLoop) {
      return;
    }

    if (trackIndex < loopPadding) {
      setTransitionEnabled(false);
      setTrackIndex(trackIndex + itemCount);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    } else if (trackIndex >= itemCount + loopPadding) {
      setTransitionEnabled(false);
      setTrackIndex(trackIndex - itemCount);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  }, [canLoop, itemCount, loopPadding, trackIndex]);

  const goTo = useCallback(
    (index: number) => {
      setTransitionEnabled(true);
      setTrackIndex(canLoop ? loopPadding + index : index);
    },
    [canLoop, loopPadding],
  );

  const goToNext = useCallback(() => {
    if (!canLoop) {
      return;
    }

    setTrackIndex((current) => current + 1);
  }, [canLoop]);

  const goToPrevious = useCallback(() => {
    if (!canLoop) {
      return;
    }

    setTrackIndex((current) => current - 1);
  }, [canLoop]);

  return {
    activeIndex,
    canLoop,
    handleTransitionEnd,
    loopPadding,
    loopedIndexes,
    setAutoplayPaused,
    trackIndex,
    transitionEnabled,
    goTo,
    goToNext,
    goToPrevious,
  };
}
