import { notFound } from "next/navigation";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import { updateOrderStatusesAction } from "../actions";

export const dynamic = "force-dynamic";

const orderStatusOptions = [
  "pending_payment",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
] as const;

const paymentStatusOptions = ["pending", "success", "failed", "cancelled"] as const;

const fulfillmentStatusOptions = [
  "pending",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
] as const;

type OrderDetailRow = {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number | string;
  shipping_total: number | string;
  grand_total: number | string;
  currency: string;
  shipping_address_snapshot: unknown;
  note: string | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  product_name_snapshot: string;
  unit_price: number | string;
  quantity: number;
  line_total: number | string;
};

type PaymentAttemptDetailRow = {
  id: string;
  gateway_name: string;
  gateway_transaction_id: string | null;
  amount: number | string;
  currency: string;
  status: string;
  verification_status: string;
  created_at: string;
};

type OrderEventRow = {
  id: string;
  event_type: string;
  payload: unknown;
  created_at: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  await requireAdmin();
  const { orderId } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdminClient() as any;

  const [{ data: order }, { data: items }, { data: payments }, { data: events }] =
    (await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, user_id, status, payment_status, fulfillment_status, subtotal, shipping_total, grand_total, currency, shipping_address_snapshot, note, created_at",
        )
        .eq("id", orderId)
        .maybeSingle(),
      supabase
        .from("order_items")
        .select("id, product_name_snapshot, unit_price, quantity, line_total")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true }),
      supabase
        .from("payment_attempts")
        .select(
          "id, gateway_name, gateway_transaction_id, amount, currency, status, verification_status, created_at",
        )
        .eq("order_id", orderId)
        .order("created_at", { ascending: false }),
      supabase
        .from("order_events")
        .select("id, event_type, payload, created_at")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false }),
    ])) as [
      { data: OrderDetailRow | null },
      { data: OrderItemRow[] | null },
      { data: PaymentAttemptDetailRow[] | null },
      { data: OrderEventRow[] | null },
    ];

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address_snapshot as {
    fullName?: string;
    email?: string;
    phone?: string;
    district?: string;
    area?: string;
    addressLine1?: string;
    addressLine2?: string | null;
    note?: string | null;
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 md:px-8">
      <div className="space-y-8">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-rose)]">
            Order detail
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-ivory)]">
            Order {order.id}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span>Status: {order.status}</span>
            <span>Payment: {order.payment_status}</span>
            <span>Fulfillment: {order.fulfillment_status}</span>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-ivory)]">
                Items
              </h2>
              <div className="mt-5 space-y-4">
                {items?.map((item) => (
                  <div
                    className="rounded-3xl border border-white/10 bg-black/10 p-4"
                    key={item.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-bonita-ivory)]">
                          {item.product_name_snapshot}
                        </p>
                        <p className="mt-2 text-sm text-white/65">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-bonita-ivory)]">
                        {formatCurrency(Number(item.line_total))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-ivory)]">
                Order timeline
              </h2>
              <div className="mt-5 space-y-4">
                {events?.map((event) => (
                  <div
                    className="rounded-3xl border border-white/10 bg-black/10 p-4"
                    key={event.id}
                  >
                    <p className="text-sm font-semibold text-[var(--color-bonita-ivory)]">
                      {event.event_type}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/55">
                      {new Date(event.created_at).toLocaleString("en-BD")}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </div>

          <div className="space-y-6">
            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-ivory)]">
                Update statuses
              </h2>
              <form action={updateOrderStatusesAction} className="mt-5 grid gap-4">
                <input name="orderId" type="hidden" value={order.id} />
                <label className="block space-y-2 text-sm">
                  <span>Order status</span>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                    defaultValue={order.status}
                    name="status"
                  >
                    {orderStatusOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Payment status</span>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                    defaultValue={order.payment_status}
                    name="paymentStatus"
                  >
                    {paymentStatusOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Fulfillment status</span>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                    defaultValue={order.fulfillment_status}
                    name="fulfillmentStatus"
                  >
                    {fulfillmentStatusOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
                  type="submit"
                >
                  Save statuses
                </button>
              </form>
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-ivory)]">
                Totals
              </h2>
              <div className="mt-5 space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(Number(order.shipping_total))}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-[var(--color-bonita-ivory)]">
                  <span>Grand total</span>
                  <span>{formatCurrency(Number(order.grand_total))}</span>
                </div>
              </div>
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-ivory)]">
                Shipping snapshot
              </h2>
              <div className="mt-5 space-y-2 text-sm text-white/70">
                <p>{shippingAddress.fullName ?? "Unknown customer"}</p>
                <p>{shippingAddress.email ?? "No email"}</p>
                <p>{shippingAddress.phone ?? "No phone"}</p>
                <p>
                  {shippingAddress.addressLine1 ?? ""}
                  {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}
                </p>
                <p>
                  {shippingAddress.area ?? ""}, {shippingAddress.district ?? ""}
                </p>
                {shippingAddress.note ? <p>Note: {shippingAddress.note}</p> : null}
                {order.note ? <p>Order note: {order.note}</p> : null}
              </div>
            </Surface>

            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <h2 className="text-lg font-semibold text-[var(--color-bonita-ivory)]">
                Payment attempts
              </h2>
              <div className="mt-5 space-y-4">
                {payments?.map((payment) => (
                  <div
                    className="rounded-3xl border border-white/10 bg-black/10 p-4"
                    key={payment.id}
                  >
                    <p className="text-sm font-semibold text-[var(--color-bonita-ivory)]">
                      {payment.gateway_name}
                    </p>
                    <p className="mt-2 text-sm text-white/65">
                      Status: {payment.status} / {payment.verification_status}
                    </p>
                    <p className="mt-2 text-sm text-white/65">
                      Amount: {formatCurrency(Number(payment.amount))}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </main>
  );
}
