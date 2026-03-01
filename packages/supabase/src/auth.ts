import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export async function getCurrentSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentSessionUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, avatar_url, marketing_consent, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return {
    user,
    profile,
  };
}

export async function requireCustomer(redirectTo = "/login") {
  const auth = await getCurrentProfile();

  if (!auth) {
    redirect(redirectTo);
  }

  return auth;
}

export async function requireAdmin(redirectTo = "/login?error=admin") {
  const auth = await getCurrentProfile();

  if (!auth || auth.profile.role !== "admin") {
    redirect(redirectTo);
  }

  return auth;
}
