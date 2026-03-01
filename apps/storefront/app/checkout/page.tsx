import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { StorefrontFrame } from "../_components/storefront-frame";
import { CheckoutPageClient } from "./checkout-page-client";

export default function CheckoutPage() {
  return (
    <StorefrontFrame currentPath="/cart">
      <section className="pt-4">
        <SectionHeading
          eyebrow="Checkout"
          title="Prepare address, payment method, and order intent before payment."
          description="This keeps the flow aligned with the master plan: validate on the server first, then connect payment initiation and real order creation in the next slice."
        />
      </section>

      <section className="pb-8">
        <CheckoutPageClient />
      </section>
    </StorefrontFrame>
  );
}
