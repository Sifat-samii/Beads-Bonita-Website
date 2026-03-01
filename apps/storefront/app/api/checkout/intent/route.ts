import { NextResponse } from "next/server";
import { checkoutIntentRequestSchema } from "@beads-bonita/core";
import { buildCheckoutIntentResponse } from "../../../_lib/checkout";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = checkoutIntentRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Checkout data is incomplete or invalid.",
      },
      { status: 400 },
    );
  }

  const result = buildCheckoutIntentResponse(parsed.data);

  return NextResponse.json(result);
}
