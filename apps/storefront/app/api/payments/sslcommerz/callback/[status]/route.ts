import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { processSslcommerzCallback } from "../../../../../_lib/order-processing";

function normalizePayload(payload: Record<string, FormDataEntryValue | string>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      typeof value === "string" ? value : value.toString(),
    ]),
  );
}

async function extractPayload(request: Request) {
  const url = new URL(request.url);
  const searchPayload = Object.fromEntries(url.searchParams.entries());
  const formData = await request.formData().catch(() => null);
  const formPayload = formData ? Object.fromEntries(formData.entries()) : {};

  return normalizePayload({
    ...searchPayload,
    ...formPayload,
  });
}

async function handleRequest(
  request: Request,
  status: "success" | "fail" | "cancel",
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdminClient() as any;
  const payload = await extractPayload(request);

  try {
    const result = await processSslcommerzCallback(supabase, {
      status,
      valId: payload.val_id ?? null,
      tranId: payload.tran_id ?? null,
      amount: payload.amount ?? null,
      currency: payload.currency ?? null,
      gatewayBody: payload,
    });

    const redirectUrl = new URL("/checkout/result", request.url);
    redirectUrl.searchParams.set("status", result.status);
    redirectUrl.searchParams.set("order", result.orderId);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    const redirectUrl = new URL("/checkout/result", request.url);
    redirectUrl.searchParams.set("status", "error");
    redirectUrl.searchParams.set(
      "message",
      error instanceof Error ? error.message : "Payment callback processing failed.",
    );
    return NextResponse.redirect(redirectUrl);
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ status: "success" | "fail" | "cancel" }> },
) {
  const { status } = await context.params;
  return handleRequest(request, status);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ status: "success" | "fail" | "cancel" }> },
) {
  const { status } = await context.params;
  return handleRequest(request, status);
}
