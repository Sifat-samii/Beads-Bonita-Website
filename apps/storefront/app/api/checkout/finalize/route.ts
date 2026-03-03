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

type ProductCheckoutRow = {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  slug: string;
  status: string;
  deleted_at: string | null;
  price: number | string;
  product_type: "ready_stock" | "made_to_order" | "custom_request_enabled";
  lead_time_days: number | null;
};

type InventoryCheckoutRow = {
  product_id: string | null;
  quantity: number;
};

type CategoryCheckoutRow = {
  id: string;
  is_active: boolean;
};

type SubcategoryCheckoutRow = {
  id: string;
  is_active: boolean;
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
  const normalizedItems = new Map<
    string,
    {
      productId: string;
      quantity: number;
      submittedPrice: number;
      submittedProductType: string;
      submittedLeadTimeDays: number | null;
    }
  >();

  for (const item of input.items) {
    const existing = normalizedItems.get(item.productId);

    normalizedItems.set(item.productId, {
      productId: item.productId,
      quantity: (existing?.quantity ?? 0) + item.quantity,
      submittedPrice: item.price,
      submittedProductType: item.productType,
      submittedLeadTimeDays: item.leadTimeDays ?? null,
    });
  }

  const productIds = [...normalizedItems.keys()];
  const [
    { data: products, error: productsError },
    { data: inventoryRows, error: inventoryError },
  ] =
    (await Promise.all([
      supabase
        .from("products")
        .select(
          "id, category_id, subcategory_id, name, slug, status, deleted_at, price, product_type, lead_time_days",
        )
        .in("id", productIds),
      supabase
        .from("inventory_stock")
        .select("product_id, quantity")
        .in("product_id", productIds)
        .not("product_id", "is", null),
    ])) as [
      { data: ProductCheckoutRow[] | null; error: { message: string } | null },
      { data: InventoryCheckoutRow[] | null; error: { message: string } | null },
    ];

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  if (inventoryError) {
    return NextResponse.json({ error: inventoryError.message }, { status: 500 });
  }

  const productMap = new Map(products?.map((product) => [product.id, product]) ?? []);
  const categoryIds = [...new Set((products ?? []).map((product) => product.category_id))];
  const subcategoryIds = [
    ...new Set(
      (products ?? [])
        .map((product) => product.subcategory_id)
        .filter((subcategoryId): subcategoryId is string => Boolean(subcategoryId)),
    ),
  ];
  const [
    { data: categoryRows, error: categoriesError },
    { data: subcategoryRows, error: subcategoriesError },
  ] = (await Promise.all([
    supabase.from("categories").select("id, is_active").in("id", categoryIds),
    subcategoryIds.length
      ? supabase.from("subcategories").select("id, is_active").in("id", subcategoryIds)
      : Promise.resolve({ data: [], error: null }),
  ])) as [
    { data: CategoryCheckoutRow[] | null; error: { message: string } | null },
    { data: SubcategoryCheckoutRow[] | null; error: { message: string } | null },
  ];

  if (categoriesError) {
    return NextResponse.json({ error: categoriesError.message }, { status: 500 });
  }

  if (subcategoriesError) {
    return NextResponse.json({ error: subcategoriesError.message }, { status: 500 });
  }

  const categoryStateMap = new Map(
    categoryRows?.map((category) => [category.id, category.is_active]) ?? [],
  );
  const subcategoryStateMap = new Map(
    subcategoryRows?.map((subcategory) => [subcategory.id, subcategory.is_active]) ?? [],
  );
  const inventoryMap = new Map(
    inventoryRows
      ?.filter((row) => row.product_id)
      .map((row) => [row.product_id as string, row.quantity]) ?? [],
  );

  const validatedItems = [];

  for (const item of normalizedItems.values()) {
    const product = productMap.get(item.productId);

    if (
      !product ||
      product.deleted_at ||
      product.status !== "published" ||
      !categoryStateMap.get(product.category_id) ||
      (product.subcategory_id && !subcategoryStateMap.get(product.subcategory_id))
    ) {
      return NextResponse.json(
        {
          error:
            "Your cart contains an unavailable product. Please refresh the cart and try again.",
        },
        { status: 409 },
      );
    }

    const livePrice = Number(product.price);
    const liveLeadTimeDays = product.lead_time_days ?? null;

    if (
      item.submittedPrice !== livePrice ||
      item.submittedProductType !== product.product_type ||
      item.submittedLeadTimeDays !== liveLeadTimeDays
    ) {
      return NextResponse.json(
        {
          error:
            "One or more cart items changed since they were added. Please review your cart and try again.",
        },
        { status: 409 },
      );
    }

    if (product.product_type === "ready_stock") {
      const availableQuantity = inventoryMap.get(product.id) ?? 0;

      if (availableQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `${product.name} does not have enough stock for the requested quantity.`,
          },
          { status: 409 },
        );
      }
    }

    validatedItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: livePrice,
      quantity: item.quantity,
      lineTotal: livePrice * item.quantity,
    });
  }

  const subtotal = validatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
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
    validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name_snapshot: item.name,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      line_total: item.lineTotal,
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
        itemNames: validatedItems.map((item) => item.name).slice(0, 3),
        itemCount: validatedItems.reduce((sum, item) => sum + item.quantity, 0),
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
