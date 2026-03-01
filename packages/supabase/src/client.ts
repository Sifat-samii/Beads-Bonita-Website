import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.generated";
import { getPublicSupabaseEnv } from "./env";

export function createSupabaseBrowserClient() {
  const { anonKey, url } = getPublicSupabaseEnv();

  return createBrowserClient<Database>(url, anonKey);
}
