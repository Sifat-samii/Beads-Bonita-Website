export type CartItem = {
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

export type CartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};
