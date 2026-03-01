"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@beads-bonita/ui/button";
import { Surface } from "@beads-bonita/ui/surface";
import { useCart } from "../_components/cart-provider";
import { formatCurrency } from "../_lib/catalog-display";

type CheckoutResponse = {
  intentId: string;
  orderId: string;
  paymentAttemptId: string;
  createdAt: string;
  itemCount: number;
  subtotal: number;
  shippingTotal: number;
  grandTotal: number;
  currency: string;
  paymentMethod: "sslcommerz" | "cash_on_delivery";
  customer: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    area: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode?: string;
    note?: string;
  };
  nextStep: string;
  payment: {
    gateway: string;
    mode: string;
    paymentUrl: string | null;
    message: string;
  };
};

type CheckoutErrorResponse = {
  error?: string;
};

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  district: "",
  area: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  note: "",
  paymentMethod: "sslcommerz" as "sslcommerz" | "cash_on_delivery",
};

export function CheckoutPageClient() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  if (!items.length) {
    return (
      <Surface className="border-white/40 bg-white/60 p-8">
        <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
          Your cart is empty, so checkout cannot begin yet. Add products first, then
          come back here to prepare shipping and payment.
        </p>
        <div className="mt-6">
          <Link href="/shop">
            <Button>Return to shop</Button>
          </Link>
        </div>
      </Surface>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <Surface className="border-white/40 bg-white/65 p-8">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              Shipping details
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
              Prepare checkout intent
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              This step validates the customer, address, and payment selection on the
              server before we connect the final payment and order creation flow.
            </p>
          </div>

          {error ? (
            <div className="rounded-[1.5rem] border border-[#d59696]/40 bg-[#8d5f5f]/18 px-5 py-4 text-sm text-[#f8dfdf]">
              {error}
            </div>
          ) : null}

          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setIsSubmitting(true);

              try {
                const response = await fetch("/api/checkout/finalize", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    customer: {
                      fullName: form.fullName,
                      email: form.email,
                      phone: form.phone,
                      district: form.district,
                      area: form.area,
                      addressLine1: form.addressLine1,
                      addressLine2: form.addressLine2 || undefined,
                      postalCode: form.postalCode || undefined,
                      note: form.note || undefined,
                    },
                    paymentMethod: form.paymentMethod,
                    items,
                  }),
                });

                const data = (await response.json()) as
                  | CheckoutResponse
                  | CheckoutErrorResponse;

                if (!response.ok) {
                  setResult(null);
                  setError(
                    "error" in data ? (data.error ?? "Checkout validation failed.") : "Checkout validation failed.",
                  );
                  return;
                }

                setResult(data as CheckoutResponse);
              } catch {
                setResult(null);
                setError("Checkout request failed. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  Full name
                </span>
                <input
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                  required
                  value={form.fullName}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  Email
                </span>
                <input
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  Phone
                </span>
                <input
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  required
                  value={form.phone}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  District
                </span>
                <input
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, district: event.target.value }))
                  }
                  required
                  value={form.district}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  Area / Thana
                </span>
                <input
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, area: event.target.value }))
                  }
                  required
                  value={form.area}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  Payment
                </span>
                <select
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: event.target.value as
                        | "sslcommerz"
                        | "cash_on_delivery",
                    }))
                  }
                  value={form.paymentMethod}
                >
                  <option value="sslcommerz">SSLCOMMERZ</option>
                  <option value="cash_on_delivery">Cash on delivery</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                  Postal code
                </span>
                <input
                  className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, postalCode: event.target.value }))
                  }
                  required={form.paymentMethod === "sslcommerz"}
                  value={form.postalCode}
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                Address line 1
              </span>
              <input
                className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                onChange={(event) =>
                  setForm((current) => ({ ...current, addressLine1: event.target.value }))
                }
                required
                value={form.addressLine1}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                Address line 2
              </span>
              <input
                className="w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                onChange={(event) =>
                  setForm((current) => ({ ...current, addressLine2: event.target.value }))
                }
                value={form.addressLine2}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">
                Order note
              </span>
              <textarea
                className="min-h-28 w-full rounded-[1.4rem] border border-white/30 bg-black/10 px-5 py-4 text-[var(--color-bonita-ivory)] outline-none placeholder:text-white/35"
                onChange={(event) =>
                  setForm((current) => ({ ...current, note: event.target.value }))
                }
                value={form.note}
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Placing..." : "Place order"}
              </Button>
              <Link href="/cart">
                <Button variant="secondary">Back to cart</Button>
              </Link>
            </div>
          </form>
        </div>
      </Surface>

      <div className="space-y-6">
        <Surface className="border-white/40 bg-white/65 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Order summary
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              <span>Shipping</span>
              <span>Calculated next</span>
            </div>
          </div>
        </Surface>

        <Surface className="border-white/40 bg-white/60 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Cart contents
          </p>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                className="rounded-[1.4rem] border border-white/45 bg-white/55 px-4 py-4"
                key={item.productId}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-bonita-charcoal)]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-bonita-clay)]">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-bonita-charcoal)]">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        {result ? (
          <Surface className="border-white/40 bg-white/65 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              Intent ready
            </p>
            <p className="mt-4 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              {result.nextStep}
            </p>
            <div className="mt-5 space-y-3 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              <p>Order ID: {result.orderId}</p>
              <p>Intent ID: {result.intentId}</p>
              <p>Payment attempt: {result.paymentAttemptId}</p>
              <p>Total: {formatCurrency(result.grandTotal)}</p>
              <p>Payment: {result.paymentMethod}</p>
              <p>{result.payment.message}</p>
            </div>
            {result.payment.paymentUrl ? (
              <div className="mt-5">
                <Link href={result.payment.paymentUrl}>
                  <Button>Continue to payment</Button>
                </Link>
              </div>
            ) : null}
          </Surface>
        ) : null}
      </div>
    </div>
  );
}
