import { NextResponse } from "next/server";

const CATEGORY_ERROR_COOKIE = "bb_products_category_error";
const SUBCATEGORY_ERROR_COOKIE = "bb_products_subcategory_error";
const PRODUCT_ERROR_COOKIE = "bb_products_product_error";
const STRUCTURE_ERROR_COOKIE = "bb_products_structure_error";
const CATEGORY_SUCCESS_COOKIE = "bb_products_category_success";
const SUBCATEGORY_SUCCESS_COOKIE = "bb_products_subcategory_success";
const PRODUCT_SUCCESS_COOKIE = "bb_products_product_success";

export async function POST() {
  const response = NextResponse.json({ cleared: true });

  response.cookies.set(CATEGORY_ERROR_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set(SUBCATEGORY_ERROR_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set(PRODUCT_ERROR_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set(STRUCTURE_ERROR_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set(CATEGORY_SUCCESS_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set(SUBCATEGORY_SUCCESS_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set(PRODUCT_SUCCESS_COOKIE, "", {
    path: "/products",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
