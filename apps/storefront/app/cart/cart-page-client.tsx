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
      <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.82)] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
          Your cart is empty
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
          There are no items ready for checkout yet. Return to the visible catalog and
          collect the pieces you want to review next.
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
    <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <Surface
            className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.82)] p-6"
            key={item.productId}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-moss)]">
                  {item.categoryName}
                  {item.subcategoryName ? ` / ${item.subcategoryName}` : ""}
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.03em] text-[var(--color-bonita-charcoal)]">
                  {item.name}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
                  {item.shortDescription}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
                  <span className="rounded-full border border-black/8 bg-[rgba(237,244,240,0.86)] px-3 py-2">
                    {item.productType.replaceAll("_", " ")}
                  </span>
                  {item.leadTimeDays ? (
                    <span className="rounded-full border border-black/8 bg-[rgba(244,236,225,0.88)] px-3 py-2">
                      Lead time {item.leadTimeDays} days
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(237,244,240,0.78),rgba(244,236,225,0.9))] p-5 lg:min-w-[240px] lg:text-right">
                <div>
                  <p className="text-xl font-semibold text-[var(--color-bonita-charcoal)]">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 lg:justify-end">
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
                <div className="mt-5 flex flex-wrap gap-3 lg:justify-end">
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

      <div className="space-y-5">
        <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.84)] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Order summary
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
            <div className="h-px bg-black/6" />
            <div className="flex items-center justify-between text-base font-semibold text-[var(--color-bonita-charcoal)]">
              <span>Estimated total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link href="/checkout">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
            <Button className="w-full" onClick={clearCart} variant="secondary">
              Clear cart
            </Button>
          </div>
        </Surface>

        <Surface className="rounded-[2rem] border-white/65 bg-[linear-gradient(180deg,rgba(237,244,240,0.82),rgba(244,236,225,0.88))] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Checkout readiness
          </p>
          <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
            The next step validates catalog visibility, pricing, and stock conditions on the
            server before payment is initiated.
          </p>
        </Surface>
      </div>
    </section>
  );
}
