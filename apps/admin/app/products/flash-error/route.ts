import { NextResponse } from "next/server";
import { PRODUCTS_FLASH_COOKIE_PATH, PRODUCTS_FLASH_COOKIES } from "../flash-state";

export async function POST() {
  const response = NextResponse.json({ cleared: true });

  for (const cookieName of Object.values(PRODUCTS_FLASH_COOKIES)) {
    response.cookies.set(cookieName, "", {
      path: PRODUCTS_FLASH_COOKIE_PATH,
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}
