type BadgeProduct = {
  isBestSeller: boolean;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  productType: "ready_stock" | "made_to_order" | "custom_request_enabled";
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProductBadges(product: BadgeProduct) {
  const badges: string[] = [];

  if (product.isLimitedEdition) {
    badges.push("Limited");
  }

  if (product.isBestSeller) {
    badges.push("Best seller");
  }

  if (product.isFeatured) {
    badges.push("Featured");
  }

  if (product.productType === "made_to_order") {
    badges.push("Made to order");
  }

  if (product.productType === "custom_request_enabled") {
    badges.push("Customizable");
  }

  return badges;
}
