export const PRODUCTS_FLASH_COOKIE_PATH = "/products";

export const PRODUCTS_FLASH_COOKIES = {
  categoryError: "bb_products_category_error",
  subcategoryError: "bb_products_subcategory_error",
  productError: "bb_products_product_error",
  structureError: "bb_products_structure_error",
  categorySuccess: "bb_products_category_success",
  subcategorySuccess: "bb_products_subcategory_success",
  productSuccess: "bb_products_product_success",
} as const;

export type ProductFlashErrorKind =
  | "category"
  | "subcategory"
  | "product"
  | "structure";

export type ProductFlashSuccessKind = "category" | "subcategory" | "product";

export function getProductFlashErrorCookieName(kind: ProductFlashErrorKind) {
  return kind === "category"
    ? PRODUCTS_FLASH_COOKIES.categoryError
    : kind === "subcategory"
      ? PRODUCTS_FLASH_COOKIES.subcategoryError
      : kind === "product"
        ? PRODUCTS_FLASH_COOKIES.productError
        : PRODUCTS_FLASH_COOKIES.structureError;
}

export function getProductFlashSuccessCookieName(kind: ProductFlashSuccessKind) {
  return kind === "category"
    ? PRODUCTS_FLASH_COOKIES.categorySuccess
    : kind === "subcategory"
      ? PRODUCTS_FLASH_COOKIES.subcategorySuccess
      : PRODUCTS_FLASH_COOKIES.productSuccess;
}
