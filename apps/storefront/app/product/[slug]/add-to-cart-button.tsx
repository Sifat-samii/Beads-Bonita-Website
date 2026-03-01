"use client";

import { useState } from "react";
import type { CartItemInput } from "@beads-bonita/core";
import { Button } from "@beads-bonita/ui/button";
import { useCart } from "../../_components/cart-provider";

export function AddToCartButton({ item }: { item: CartItemInput }) {
  const { addItem } = useCart();
  const [hasAdded, setHasAdded] = useState(false);

  return (
    <Button
      onClick={() => {
        addItem(item);
        setHasAdded(true);

        window.setTimeout(() => {
          setHasAdded(false);
        }, 1800);
      }}
    >
      {hasAdded ? "Added" : "Add to cart"}
    </Button>
  );
}
