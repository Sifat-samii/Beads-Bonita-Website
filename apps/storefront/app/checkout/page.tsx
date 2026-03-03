import { StorefrontFrame } from "../_components/storefront-frame";
import { StorefrontPageHero } from "../_components/storefront-page-hero";
import { CheckoutPageClient } from "./checkout-page-client";

export default function CheckoutPage() {
  return (
    <StorefrontFrame currentPath="/cart">
      <StorefrontPageHero
        accent="Address capture, payment selection, and order intent creation now sit in one cleaner interface."
        description="Checkout validates the order server-side before payment, keeping price, stock, and archived-product rules consistent with the live storefront."
        eyebrow="Checkout"
        primaryCta={{ href: "/cart", label: "Review cart" }}
        secondaryCta={{ href: "/shop", label: "Return to catalog" }}
        title="Prepare shipping and payment before confirmation."
      />

      <CheckoutPageClient />
    </StorefrontFrame>
  );
}
