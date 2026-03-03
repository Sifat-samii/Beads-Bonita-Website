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

function FieldShell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="space-y-2.5">
      <span className="text-sm font-medium text-[var(--color-bonita-charcoal)]">{label}</span>
      {children}
    </label>
  );
}

const fieldClassName =
  "w-full rounded-[1.3rem] border border-black/8 bg-white/82 px-5 py-4 text-[var(--color-bonita-charcoal)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-bonita-charcoal)_34%,white)]";

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
      <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.82)] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
          Checkout unavailable
        </p>
        <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
          Your cart is empty, so there is nothing to validate yet. Add visible products to
          the cart first, then return here.
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
    <section className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
      <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.84)] p-7 sm:p-8">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              Shipping and payment
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em] text-[var(--color-bonita-charcoal)]">
              Complete the order details.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              This form prepares the order intent and validates the current cart against
              live catalog rules before payment continues.
            </p>
          </div>

          {error ? (
            <div className="rounded-[1.5rem] border border-[#d59696]/40 bg-[#f6d8d8]/60 px-5 py-4 text-sm text-[#7e3f3f]">
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
                    "error" in data
                      ? (data.error ?? "Checkout validation failed.")
                      : "Checkout validation failed.",
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
              <FieldShell label="Full name">
                <input
                  className={fieldClassName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                  required
                  value={form.fullName}
                />
              </FieldShell>
              <FieldShell label="Email">
                <input
                  className={fieldClassName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                  type="email"
                  value={form.email}
                />
              </FieldShell>
              <FieldShell label="Phone">
                <input
                  className={fieldClassName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  required
                  value={form.phone}
                />
              </FieldShell>
              <FieldShell label="District">
                <input
                  className={fieldClassName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, district: event.target.value }))
                  }
                  required
                  value={form.district}
                />
              </FieldShell>
              <FieldShell label="Area / Thana">
                <input
                  className={fieldClassName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, area: event.target.value }))
                  }
                  required
                  value={form.area}
                />
              </FieldShell>
              <FieldShell label="Payment method">
                <select
                  className={fieldClassName}
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
              </FieldShell>
              <FieldShell label="Postal code">
                <input
                  className={fieldClassName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, postalCode: event.target.value }))
                  }
                  required={form.paymentMethod === "sslcommerz"}
                  value={form.postalCode}
                />
              </FieldShell>
            </div>

            <FieldShell label="Address line 1">
              <input
                className={fieldClassName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, addressLine1: event.target.value }))
                }
                required
                value={form.addressLine1}
              />
            </FieldShell>

            <FieldShell label="Address line 2">
              <input
                className={fieldClassName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, addressLine2: event.target.value }))
                }
                value={form.addressLine2}
              />
            </FieldShell>

            <FieldShell label="Order note">
              <textarea
                className={`${fieldClassName} min-h-28`}
                onChange={(event) =>
                  setForm((current) => ({ ...current, note: event.target.value }))
                }
                value={form.note}
              />
            </FieldShell>

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

      <div className="space-y-5">
        <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.84)] p-7">
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

        <Surface className="rounded-[2rem] border-white/65 bg-[linear-gradient(180deg,rgba(237,244,240,0.84),rgba(244,236,225,0.88))] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Cart contents
          </p>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                className="rounded-[1.4rem] border border-white/55 bg-white/72 px-4 py-4"
                key={item.productId}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-bonita-charcoal)]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-bonita-clay)]">
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
          <Surface className="rounded-[2rem] border-white/65 bg-[rgba(255,255,255,0.84)] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              Intent ready
            </p>
            <p className="mt-4 text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
              {result.nextStep}
            </p>
            <div className="mt-5 space-y-2 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
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
    </section>
  );
}
