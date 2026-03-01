type CheckoutIntentItem = {
  productId: string;
  slug: string;
  name: string;
  categoryName: string;
  subcategoryName?: string | null;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  productType: "ready_stock" | "made_to_order" | "custom_request_enabled";
  leadTimeDays?: number | null;
  quantity: number;
};

type CheckoutIntentRequest = {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    area: string;
    addressLine1: string;
    addressLine2?: string;
    note?: string;
  };
  paymentMethod: "sslcommerz" | "cash_on_delivery";
  items: CheckoutIntentItem[];
};

export function calculateCheckoutSubtotal(items: CheckoutIntentItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function buildCheckoutIntentResponse(input: CheckoutIntentRequest) {
  const subtotal = calculateCheckoutSubtotal(input.items);
  const shippingTotal = 0;

  return {
    intentId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    itemCount: input.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shippingTotal,
    grandTotal: subtotal + shippingTotal,
    currency: "BDT",
    paymentMethod: input.paymentMethod,
    customer: input.customer,
    nextStep:
      input.paymentMethod === "sslcommerz"
        ? "Checkout intent created. The next slice will connect this payload to SSLCOMMERZ initiation."
        : "Checkout intent created. The next slice will convert this into a pending cash-on-delivery order flow.",
  };
}
