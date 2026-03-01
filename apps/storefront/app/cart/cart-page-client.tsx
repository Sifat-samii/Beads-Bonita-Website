"use client";

import Link from "next/link";
import { Button } from "@beads-bonita/ui/button";
import { Surface } from "@beads-bonita/ui/surface";
import { useCart } from "../_components/cart-provider";
import { formatCurrency } from "../_lib/catalog-display";

export function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (!items.length) {
    return (
      <Surface className="border-white/40 bg-white/60 p-8">
        <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
          Your cart is empty right now. Browse the published catalog and collect the
          pieces you want to carry into checkout next.
        </p>
        <div className="mt-6">
          <Link href="/shop">
            <Button>Browse the shop</Button>
          </Link>
        </div>
      </Surface>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <Surface className="border-white/40 bg-white/65 p-6" key={item.productId}>
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-moss)]">
                  {item.categoryName}
                  {item.subcategoryName ? ` / ${item.subcategoryName}` : ""}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-bonita-charcoal)]">
                  {item.name}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                  {item.shortDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-bonita-clay)]">
                  <span className="rounded-full border border-white/60 bg-white/70 px-3 py-2">
                    {item.productType.replaceAll("_", " ")}
                  </span>
                  {item.leadTimeDays ? (
                    <span className="rounded-full border border-white/60 bg-white/70 px-3 py-2">
                      Lead time {item.leadTimeDays} days
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4 md:text-right">
                <div>
                  <p className="text-lg font-semibold text-[var(--color-bonita-charcoal)]">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <Button
                    className="!px-3 !py-2"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    variant="ghost"
                  >
                    -
                  </Button>
                  <span className="min-w-10 text-center text-sm font-semibold text-[var(--color-bonita-charcoal)]">
                    {item.quantity}
                  </span>
                  <Button
                    className="!px-3 !py-2"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    variant="ghost"
                  >
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Link href={`/product/${item.slug}`}>
                    <Button variant="secondary">View product</Button>
                  </Link>
                  <Button onClick={() => removeItem(item.productId)} variant="ghost">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="h-fit border-white/40 bg-white/65 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
          Cart summary
        </p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="h-px bg-white/55" />
          <div className="flex items-center justify-between text-base font-semibold text-[var(--color-bonita-charcoal)]">
            <span>Estimated total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link href="/checkout">
            <Button className="w-full">Checkout next</Button>
          </Link>
          <Button className="w-full" onClick={clearCart} variant="secondary">
            Clear cart
          </Button>
        </div>

        <p className="mt-5 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
          This cart foundation is now ready. The next slice will connect it to checkout,
          shipping, and server-side order creation.
        </p>
      </Surface>
    </div>
  );
}
