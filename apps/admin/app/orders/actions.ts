"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";

export async function updateOrderStatusesAction(formData: FormData) {
  const { profile } = await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  const paymentStatus = String(formData.get("paymentStatus") ?? "");
  const fulfillmentStatus = String(formData.get("fulfillmentStatus") ?? "");

  if (!orderId || !status || !paymentStatus || !fulfillmentStatus) {
    throw new Error("Order status update requires all fields.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdminClient() as any;

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status,
      payment_status: paymentStatus,
      fulfillment_status: fulfillmentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (orderError) {
    throw new Error(orderError.message);
  }

  const { error: eventError } = await supabase.from("order_events").insert({
    order_id: orderId,
    actor_id: profile.id,
    event_type: "admin_status_update",
    payload: {
      status,
      paymentStatus,
      fulfillmentStatus,
    },
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}
