import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { StorefrontFrame } from "../_components/storefront-frame";
import { CartPageClient } from "./cart-page-client";

export default function CartPage() {
  return (
    <StorefrontFrame currentPath="/cart">
      <section className="pt-4">
        <SectionHeading
          eyebrow="Cart"
          title="A calm review step before checkout, shipping, and payment."
          description="Keep the cart lightweight and clear now, then connect it directly into checkout and SSLCOMMERZ in the next commerce slice."
        />
      </section>

      <section className="pb-8">
        <CartPageClient />
      </section>
    </StorefrontFrame>
  );
}
