import { NextResponse } from "next/server";
import { checkoutFinalizeRequestSchema } from "@beads-bonita/core";
import { getCurrentSessionUser } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { buildCheckoutIntentResponse, calculateCheckoutSubtotal } from "../../../_lib/checkout";
import {
  buildMerchantTransactionId,
  createSslcommerzSession,
} from "../../../_lib/sslcommerz";

type AddressRow = {
  id: string;
  full_name: string;
  phone: string;
  district: string;
  area: string;
  address_line_1: string;
  address_line_2: string | null;
  postal_code: string | null;
};

type OrderRow = {
  id: string;
  created_at: string;
};

type PaymentAttemptRow = {
  id: string;
};

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please log in before placing an order." },
      { status: 401 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = checkoutFinalizeRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Checkout payload is incomplete or invalid.",
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdminClient() as any;
  const subtotal = calculateCheckoutSubtotal(input.items);
  const shippingTotal = 0;
  const grandTotal = subtotal + shippingTotal;

  const { data: address, error: addressError } = (await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      full_name: input.customer.fullName,
      phone: input.customer.phone,
      district: input.customer.district,
      area: input.customer.area,
      address_line_1: input.customer.addressLine1,
      address_line_2: input.customer.addressLine2 || null,
      postal_code: input.customer.postalCode || null,
      is_default: false,
    })
    .select("id, full_name, phone, district, area, address_line_1, address_line_2, postal_code")
    .single()) as { data: AddressRow | null; error: { message: string } | null };

  if (addressError) {
    return NextResponse.json({ error: addressError.message }, { status: 500 });
  }

  if (!address) {
    return NextResponse.json(
      { error: "Address could not be created." },
      { status: 500 },
    );
  }

  const shippingAddressSnapshot = {
    id: address.id,
    fullName: address.full_name,
    email: input.customer.email,
    phone: address.phone,
    district: address.district,
    area: address.area,
    addressLine1: address.address_line_1,
    addressLine2: address.address_line_2,
    postalCode: address.postal_code,
    note: input.customer.note || null,
  };

  const { data: order, error: orderError } = (await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending_payment",
      payment_status: "pending",
      fulfillment_status: "pending",
      subtotal,
      discount_total: 0,
      shipping_total: shippingTotal,
      grand_total: grandTotal,
      currency: "BDT",
      shipping_address_snapshot: shippingAddressSnapshot,
      note: input.customer.note || null,
    })
    .select("id, created_at")
    .single()) as { data: OrderRow | null; error: { message: string } | null };

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json({ error: "Order could not be created." }, { status: 500 });
  }

  const merchantTransactionId = buildMerchantTransactionId(order.id);

  const { error: orderItemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name_snapshot: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
    })),
  );

  if (orderItemsError) {
    return NextResponse.json({ error: orderItemsError.message }, { status: 500 });
  }

  const { data: paymentAttempt, error: paymentAttemptError } = (await supabase
    .from("payment_attempts")
    .insert({
      order_id: order.id,
      gateway_name:
        input.paymentMethod === "sslcommerz" ? "sslcommerz" : "cash_on_delivery",
      gateway_transaction_id:
        input.paymentMethod === "sslcommerz" ? merchantTransactionId : null,
      amount: grandTotal,
      currency: "BDT",
      status: "pending",
      verification_status:
        input.paymentMethod === "sslcommerz" ? "awaiting_gateway_redirect" : "cod_pending",
      raw_response_sanitized: {
        paymentMethod: input.paymentMethod,
        createdFrom: "storefront_checkout_finalize",
        merchantTransactionId,
      },
    })
    .select("id")
    .single()) as { data: PaymentAttemptRow | null; error: { message: string } | null };

  if (paymentAttemptError) {
    return NextResponse.json({ error: paymentAttemptError.message }, { status: 500 });
  }

  if (!paymentAttempt) {
    return NextResponse.json(
      { error: "Payment attempt could not be created." },
      { status: 500 },
    );
  }

  let payment:
    | {
        gateway: string;
        mode: string;
        paymentUrl: string | null;
        message: string;
      }
    | null = null;

  if (input.paymentMethod === "sslcommerz") {
    try {
      const sslSession = await createSslcommerzSession({
        origin: new URL(request.url).origin,
        orderId: order.id,
        merchantTransactionId,
        paymentAttemptId: paymentAttempt.id,
        amount: grandTotal,
        customer: {
          fullName: input.customer.fullName,
          email: input.customer.email,
          phone: input.customer.phone,
          district: input.customer.district,
          area: input.customer.area,
          addressLine1: input.customer.addressLine1,
          addressLine2: input.customer.addressLine2,
          postalCode: input.customer.postalCode || "1200",
        },
        itemNames: input.items.map((item) => item.name).slice(0, 3),
        itemCount: input.items.reduce((sum, item) => sum + item.quantity, 0),
      });

      await supabase
        .from("payment_attempts")
        .update({
          verification_status: "gateway_session_created",
          raw_response_sanitized: {
            paymentMethod: input.paymentMethod,
            createdFrom: "storefront_checkout_finalize",
            merchantTransactionId,
            gatewaySession: sslSession.raw,
          },
        })
        .eq("id", paymentAttempt.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        actor_id: user.id,
        event_type: "payment_session_created",
        payload: {
          paymentAttemptId: paymentAttempt.id,
          merchantTransactionId,
          gatewayMode: sslSession.mode,
        },
      });

      payment = {
        gateway: "sslcommerz",
        mode: sslSession.mode,
        paymentUrl: sslSession.gatewayPageUrl,
        message: "SSLCOMMERZ session created. Continue to the hosted payment page.",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to initiate SSLCOMMERZ session.";

      await supabase
        .from("payment_attempts")
        .update({
          status: "failed",
          verification_status: "initiation_failed",
          raw_response_sanitized: {
            paymentMethod: input.paymentMethod,
            createdFrom: "storefront_checkout_finalize",
            merchantTransactionId,
            initiationError: message,
          },
        })
        .eq("id", paymentAttempt.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        actor_id: user.id,
        event_type: "payment_session_failed",
        payload: {
          paymentAttemptId: paymentAttempt.id,
          merchantTransactionId,
          error: message,
        },
      });

      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const { error: orderEventError } = await supabase.from("order_events").insert({
    order_id: order.id,
    actor_id: user.id,
    event_type: "checkout_finalized",
    payload: {
      paymentMethod: input.paymentMethod,
      itemCount: input.items.length,
      paymentAttemptId: paymentAttempt.id,
    },
  });

  if (orderEventError) {
    return NextResponse.json({ error: orderEventError.message }, { status: 500 });
  }

  const intentSummary = buildCheckoutIntentResponse(input);

  return NextResponse.json({
    ...intentSummary,
    orderId: order.id,
    paymentAttemptId: paymentAttempt.id,
    createdAt: order.created_at,
    payment:
      payment ?? {
        gateway: "cash_on_delivery",
        mode: "manual",
        paymentUrl: null,
        message:
          "Cash on delivery order created. The order is now pending admin review and fulfillment handling.",
      },
  });
}
