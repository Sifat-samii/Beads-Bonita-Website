import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSupabaseSession } from "@beads-bonita/supabase/middleware";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsSessionRefresh =
    pathname.startsWith("/account") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/checkout") ||
    pathname.startsWith("/api/payments");

  if (!needsSessionRefresh) {
    return NextResponse.next({
      request,
    });
  }

  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
