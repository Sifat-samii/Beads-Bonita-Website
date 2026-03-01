"use client";

import { useTransition } from "react";

type DeleteProductButtonProps = {
  action: () => Promise<void>;
  productName: string;
};

export function DeleteProductButton({
  action,
  productName,
}: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="rounded-full border border-rose-300/20 bg-rose-200/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() => {
        const shouldDelete = window.confirm(
          `Delete "${productName}"? This will remove the product and its related records.`,
        );

        if (!shouldDelete) {
          return;
        }

        startTransition(async () => {
          await action();
        });
      }}
      type="button"
    >
      {isPending ? "Deleting..." : "Delete product"}
    </button>
  );
}
