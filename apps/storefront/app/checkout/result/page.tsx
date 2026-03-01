import Link from "next/link";
import { Button } from "@beads-bonita/ui/button";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../../_components/storefront-frame";

type CheckoutResultPageProps = {
  searchParams?: Promise<{
    status?: string;
    order?: string;
    message?: string;
  }>;
};

const statusText = {
  success: {
    title: "Payment verified",
    body: "Your payment has been verified and the order has been confirmed.",
  },
  failed: {
    title: "Payment failed",
    body: "The payment could not be validated. You can return to checkout and try again.",
  },
  cancelled: {
    title: "Payment cancelled",
    body: "The payment was cancelled before completion.",
  },
  error: {
    title: "Payment processing issue",
    body: "The callback could not be processed cleanly. Check the order in admin and retry if needed.",
  },
} as const;

export default async function CheckoutResultPage({
  searchParams,
}: CheckoutResultPageProps) {
  const params = await searchParams;
  const status = params?.status ?? "error";
  const content =
    status in statusText
      ? statusText[status as keyof typeof statusText]
      : statusText.error;

  return (
    <StorefrontFrame currentPath="/cart">
      <section className="py-8">
        <Surface className="mx-auto max-w-3xl border-white/40 bg-white/65 p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
            Checkout result
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-charcoal)]">
            {content.title}
          </h1>
          <p className="mt-5 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
            {params?.message ?? content.body}
          </p>
          {params?.order ? (
            <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
              Order ID: {params.order}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button>Continue shopping</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Return to checkout</Button>
            </Link>
          </div>
        </Surface>
      </section>
    </StorefrontFrame>
  );
}
