import { StorefrontFrame } from "../_components/storefront-frame";
import { StorefrontPageHero } from "../_components/storefront-page-hero";
import { CartPageClient } from "./cart-page-client";

export default function CartPage() {
  return (
    <StorefrontFrame currentPath="/cart">
      <StorefrontPageHero
        accent="Review quantities, remove items, and move directly into the validated checkout flow."
        description="The cart now acts as the final review layer before address capture, payment selection, and server-side order validation."
        eyebrow="Cart"
        primaryCta={{ href: "/checkout", label: "Go to checkout" }}
        secondaryCta={{ href: "/shop", label: "Keep shopping" }}
        title="A clear review step before payment."
      />

      <CartPageClient />
    </StorefrontFrame>
  );
}
