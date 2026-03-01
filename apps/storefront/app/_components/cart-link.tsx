"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@beads-bonita/ui/button";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <Button className="!px-4 !py-2" variant="ghost">
        <span className="flex items-center gap-2">
          <ShoppingBag className="size-4" />
          Cart
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] tracking-[0.12em] text-[var(--color-bonita-charcoal)]">
            {totalItems}
          </span>
        </span>
      </Button>
    </Link>
  );
}
