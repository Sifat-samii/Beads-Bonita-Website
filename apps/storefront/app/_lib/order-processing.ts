import { validateSslcommerzPayment, type SslcommerzValidationResponse } from "./sslcommerz";

type PaymentAttemptRecord = {
  id: string;
  order_id: string;
  amount: number | string;
  currency: string;
  status: string;
  verification_status: string;
  gateway_transaction_id: string | null;
  raw_response_sanitized: Record<string, unknown> | null;
};

type OrderRecord = {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
};

type OrderItemRecord = {
  id: string;
  product_id: string;
  quantity: number;
  product_name_snapshot: string;
};

type ProductRecord = {
  id: string;
  name: string;
  product_type: "ready_stock" | "made_to_order" | "custom_request_enabled";
};

type InventoryRecord = {
  id: string;
  product_id: string | null;
  quantity: number;
};

type CallbackPayload = {
  status: "success" | "fail" | "cancel" | "ipn";
  valId?: string | null;
  tranId?: string | null;
  amount?: string | null;
  currency?: string | null;
  gatewayBody: Record<string, unknown>;
};

function mergeRawResponse(
  existing: Record<string, unknown> | null,
  update: Record<string, unknown>,
) {
  return {
    ...(existing ?? {}),
    ...update,
  };
}

async function logSystemEvent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  source: string,
  message: string,
  payload: Record<string, unknown>,
) {
  await supabase.from("system_events").insert({
    level: "error",
    source,
    message,
    payload,
  });
}

async function deductVerifiedInventory(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  input: {
    orderId: string;
    actorProfileId: string;
  },
) {
  const [{ data: items }, { data: products }, { data: inventoryRows }] = (await Promise.all([
    supabase
      .from("order_items")
      .select("id, product_id, quantity, product_name_snapshot")
      .eq("order_id", input.orderId),
    supabase.from("products").select("id, name, product_type"),
    supabase.from("inventory_stock").select("id, product_id, quantity").not("product_id", "is", null),
  ])) as [
    { data: OrderItemRecord[] | null },
    { data: ProductRecord[] | null },
    { data: InventoryRecord[] | null },
  ];

  const productMap = new Map(products?.map((product) => [product.id, product]) ?? []);
  const inventoryMap = new Map(
    inventoryRows
      ?.filter((row) => row.product_id)
      .map((row) => [row.product_id as string, row]) ?? [],
  );

  for (const item of items ?? []) {
    const product = productMap.get(item.product_id);

    if (!product || product.product_type !== "ready_stock") {
      continue;
    }

    const inventory = inventoryMap.get(item.product_id);

    if (!inventory) {
      throw new Error(`Missing inventory row for ${product.name}.`);
    }

    if (inventory.quantity < item.quantity) {
      throw new Error(`Insufficient inventory for ${product.name}.`);
    }

    const nextQuantity = inventory.quantity - item.quantity;
    const { error: inventoryUpdateError } = await supabase
      .from("inventory_stock")
      .update({ quantity: nextQuantity, updated_at: new Date().toISOString() })
      .eq("id", inventory.id);

    if (inventoryUpdateError) {
      throw new Error(inventoryUpdateError.message);
    }

    const { error: adjustmentError } = await supabase.from("inventory_adjustments").insert({
      inventory_stock_id: inventory.id,
      admin_id: input.actorProfileId,
      reason: `Automated deduction after verified payment for order ${input.orderId}`,
      delta: -item.quantity,
    });

    if (adjustmentError) {
      throw new Error(adjustmentError.message);
    }
  }
}

function isSuccessfulValidation(
  validation: SslcommerzValidationResponse,
  paymentAttempt: PaymentAttemptRecord,
) {
  const validatedAmount = Number(validation.amount ?? 0);
  const expectedAmount = Number(paymentAttempt.amount);
  const normalizedStatus = (validation.status ?? "").toUpperCase();
  const normalizedCurrency = validation.currency ?? validation.currency_type ?? "BDT";

  return (
    ["VALID", "VALIDATED"].includes(normalizedStatus) &&
    validation.tran_id === paymentAttempt.gateway_transaction_id &&
    validatedAmount === expectedAmount &&
    normalizedCurrency === paymentAttempt.currency
  );
}

export async function processSslcommerzCallback(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  payload: CallbackPayload,
) {
  if (!payload.tranId) {
    throw new Error("Missing SSLCOMMERZ transaction id.");
  }

  const { data: paymentAttempt, error: paymentError } = (await supabase
    .from("payment_attempts")
    .select(
      "id, order_id, amount, currency, status, verification_status, gateway_transaction_id, raw_response_sanitized",
    )
    .eq("gateway_transaction_id", payload.tranId)
    .maybeSingle()) as {
    data: PaymentAttemptRecord | null;
    error: { message: string } | null;
  };

  if (paymentError) {
    throw new Error(paymentError.message);
  }

  if (!paymentAttempt) {
    throw new Error(`Payment attempt not found for transaction ${payload.tranId}.`);
  }

  const { data: order, error: orderError } = (await supabase
    .from("orders")
    .select("id, user_id, status, payment_status, fulfillment_status")
    .eq("id", paymentAttempt.order_id)
    .maybeSingle()) as { data: OrderRecord | null; error: { message: string } | null };

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (!order) {
    throw new Error(`Order not found for payment attempt ${paymentAttempt.id}.`);
  }

  if (payload.status === "success" || payload.status === "ipn") {
    if (!payload.valId) {
      throw new Error("Missing validation id from SSLCOMMERZ callback.");
    }

    const validation = await validateSslcommerzPayment(payload.valId);

    if (!isSuccessfulValidation(validation, paymentAttempt)) {
      await supabase
        .from("payment_attempts")
        .update({
          status: "failed",
          verification_status: "validation_failed",
          raw_response_sanitized: mergeRawResponse(paymentAttempt.raw_response_sanitized, {
            callback: payload.gatewayBody,
            validation,
          }),
        })
        .eq("id", paymentAttempt.id);

      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_status: "failed",
        })
        .eq("id", order.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        actor_id: order.user_id,
        event_type: "payment_validation_failed",
        payload: {
          callback: payload.gatewayBody,
          validation,
        },
      });

      return { orderId: order.id, paymentAttemptId: paymentAttempt.id, status: "failed" };
    }

    if (paymentAttempt.status !== "success" || order.payment_status !== "success") {
      try {
        await deductVerifiedInventory(supabase, {
          orderId: order.id,
          actorProfileId: order.user_id,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown inventory error.";

        await supabase
          .from("payment_attempts")
          .update({
            status: "success",
            verification_status: "validated_with_inventory_issue",
            raw_response_sanitized: mergeRawResponse(paymentAttempt.raw_response_sanitized, {
              callback: payload.gatewayBody,
              validation,
              inventoryIssue: message,
            }),
          })
          .eq("id", paymentAttempt.id);

        await supabase
          .from("orders")
          .update({
            status: "confirmed",
            payment_status: "success",
          })
          .eq("id", order.id);

        await supabase.from("order_events").insert({
          order_id: order.id,
          actor_id: order.user_id,
          event_type: "payment_verified_inventory_issue",
          payload: {
            validation,
            issue: message,
          },
        });

        await logSystemEvent(
          supabase,
          "sslcommerz_callback",
          "Inventory deduction failed after verified payment.",
          {
            orderId: order.id,
            paymentAttemptId: paymentAttempt.id,
            issue: message,
          },
        );

        return { orderId: order.id, paymentAttemptId: paymentAttempt.id, status: "success" };
      }

      await supabase
        .from("payment_attempts")
        .update({
          status: "success",
          verification_status: "validated",
          raw_response_sanitized: mergeRawResponse(paymentAttempt.raw_response_sanitized, {
            callback: payload.gatewayBody,
            validation,
          }),
        })
        .eq("id", paymentAttempt.id);

      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_status: "success",
        })
        .eq("id", order.id);

      await supabase.from("order_events").insert({
        order_id: order.id,
        actor_id: order.user_id,
        event_type: "payment_verified",
        payload: {
          validation,
        },
      });
    }

    return { orderId: order.id, paymentAttemptId: paymentAttempt.id, status: "success" };
  }

  if (paymentAttempt.status === "success" || order.payment_status === "success") {
    return { orderId: order.id, paymentAttemptId: paymentAttempt.id, status: "success" };
  }

  const failedStatus = payload.status === "cancel" ? "cancelled" : "failed";

  await supabase
    .from("payment_attempts")
    .update({
      status: failedStatus,
      verification_status:
        payload.status === "cancel" ? "callback_cancelled" : "callback_failed",
      raw_response_sanitized: mergeRawResponse(paymentAttempt.raw_response_sanitized, {
        callback: payload.gatewayBody,
      }),
    })
    .eq("id", paymentAttempt.id);

  await supabase
    .from("orders")
    .update({
      status: "cancelled",
      payment_status: failedStatus,
    })
    .eq("id", order.id);

  await supabase.from("order_events").insert({
    order_id: order.id,
    actor_id: order.user_id,
    event_type: payload.status === "cancel" ? "payment_cancelled" : "payment_failed",
    payload: {
      callback: payload.gatewayBody,
    },
  });

  return { orderId: order.id, paymentAttemptId: paymentAttempt.id, status: failedStatus };
}
