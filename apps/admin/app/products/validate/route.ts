import { NextResponse } from "next/server";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim() ?? "";
  const slug = searchParams.get("slug")?.trim() ?? "";
  const sku = searchParams.get("sku")?.trim() ?? "";
  const excludeProductId = searchParams.get("excludeProductId")?.trim() ?? "";
  const supabase = getSupabaseAdminClient();

  const nameQuery = name
    ? supabase
        .from("products")
        .select("id")
        .is("deleted_at", null)
        .ilike("name", name)
        .limit(1)
    : Promise.resolve({ data: [], error: null });
  const slugQuery = slug
    ? supabase
        .from("products")
        .select("id")
        .is("deleted_at", null)
        .eq("slug", slug)
        .limit(1)
    : Promise.resolve({ data: [], error: null });
  const skuQuery = sku
    ? supabase
        .from("products")
        .select("id")
        .is("deleted_at", null)
        .eq("sku", sku)
        .limit(1)
    : Promise.resolve({ data: [], error: null });

  const [nameResult, slugResult, skuResult] = await Promise.all([
    nameQuery,
    slugQuery,
    skuQuery,
  ]);

  for (const result of [nameResult, slugResult, skuResult]) {
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
  }

  const nameExists = !!nameResult.data?.some((row) => row.id !== excludeProductId);
  const slugExists = !!slugResult.data?.some((row) => row.id !== excludeProductId);
  const skuExists = !!skuResult.data?.some((row) => row.id !== excludeProductId);

  return NextResponse.json({
    nameExists,
    slugExists,
    skuExists,
  });
}
