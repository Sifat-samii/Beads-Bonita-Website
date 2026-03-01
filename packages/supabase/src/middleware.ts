import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.generated";
import { getPublicSupabaseEnv } from "./env";

export function updateSupabaseSession(request: NextRequest) {
  const { anonKey, url } = getPublicSupabaseEnv();
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => request.cookies.set(cookie.name, cookie.value));

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach((cookie) =>
          response.cookies.set(cookie.name, cookie.value, cookie.options),
        );
      },
    },
  });

  void supabase.auth.getUser();

  return response;
}
