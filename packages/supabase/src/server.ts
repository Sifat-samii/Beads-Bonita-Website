import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.generated";
import { getPublicSupabaseEnv, getServiceRoleKey } from "./env";

export async function createSupabaseServerClient() {
  const { anonKey, url } = getPublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // In server components, Next.js does not allow mutating cookies.
            // Middleware handles session refresh writes for read-only requests.
          }
        });
      },
    },
  });
}

export function getSupabaseAdminClient() {
  const { url } = getPublicSupabaseEnv();

  return createServerClient<Database>(url, getServiceRoleKey(), {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
