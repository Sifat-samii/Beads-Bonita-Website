import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { processSslcommerzCallback } from "../../../../_lib/order-processing";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const payload = Object.fromEntries(formData?.entries() ?? []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdminClient() as any;

  try {
    const result = await processSslcommerzCallback(supabase, {
      status: "ipn",
      valId: typeof payload.val_id === "string" ? payload.val_id : null,
      tranId: typeof payload.tran_id === "string" ? payload.tran_id : null,
      amount: typeof payload.amount === "string" ? payload.amount : null,
      currency: typeof payload.currency === "string" ? payload.currency : null,
      gatewayBody: Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [
          key,
          typeof value === "string" ? value : value.toString(),
        ]),
      ),
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "IPN processing failed.",
      },
      { status: 400 },
    );
  }
}
