"use client";

import { useEffect, useRef, useState, useTransition } from "react";

type CategoryOptionsMenuProps = {
  categoryName: string;
  isActive: boolean;
  onDelete: () => void | Promise<void>;
  onToggleStatus: () => void | Promise<void>;
};

export function CategoryOptionsMenu({
  categoryName,
  isActive,
  onDelete,
  onToggleStatus,
}: CategoryOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setIsDeleteWarningOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-white/70"
        disabled={isPending}
        onClick={() => {
          setIsDeleteWarningOpen(false);
          setIsOpen((current) => !current);
        }}
        type="button"
      >
        ...
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-10 z-10 min-w-36 rounded-2xl border border-white/10 bg-[rgba(39,31,28,0.96)] p-2 shadow-xl backdrop-blur">
          <button
            className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await onToggleStatus();
                setIsOpen(false);
              });
            }}
            type="button"
          >
            {isActive ? "Archive" : "Publish"}
          </button>
          <button
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-rose-100 transition hover:bg-rose-200/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() => setIsDeleteWarningOpen(true)}
            type="button"
          >
            Delete
          </button>
        </div>
      ) : null}
      {isDeleteWarningOpen ? (
        <div className="absolute right-0 top-10 z-20 w-72 rounded-2xl border border-rose-300/20 bg-[rgba(43,27,25,0.98)] p-4 shadow-xl backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-300/30 text-sm font-bold text-rose-100">
              !
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-rose-100">Warning</p>
              <p className="mt-1 text-xs leading-5 text-rose-50/85">
                Deleting {categoryName} will automatically remove all subcategories and
                products under this category.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70"
              disabled={isPending}
              onClick={() => setIsDeleteWarningOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-rose-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-bonita-charcoal)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await onDelete();
                  setIsDeleteWarningOpen(false);
                  setIsOpen(false);
                });
              }}
              type="button"
            >
              Confirm delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
