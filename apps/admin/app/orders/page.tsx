import Link from "next/link";
import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";

export const dynamic = "force-dynamic";

type OrderListRow = {
  id: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  grand_total: number | string;
  currency: string;
  created_at: string;
  user_id: string;
};

type ProfileListRow = {
  id: string;
  full_name: string | null;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function OrdersPage() {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdminClient() as any;

  const [{ data: orders }, { data: profiles }] = (await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, status, payment_status, fulfillment_status, grand_total, currency, created_at, user_id",
      )
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name"),
  ])) as [{ data: OrderListRow[] | null }, { data: ProfileListRow[] | null }];

  const profileMap = new Map(profiles?.map((profile) => [profile.id, profile]) ?? []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 md:px-8">
      <div className="space-y-8">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-rose)]">
            Orders
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-ivory)]">
            Checkout-created orders and payment attempts
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            This is the first admin inspection surface for real orders created from the
            storefront checkout flow.
          </p>
        </Surface>

        <div className="grid gap-4">
          {orders?.length ? (
            orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none transition hover:bg-white/12">
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                        {order.status}
                      </p>
                      <h2 className="mt-3 text-xl font-semibold text-[var(--color-bonita-ivory)]">
                        Order {order.id}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">
                        <span>
                          Customer:{" "}
                          {profileMap.get(order.user_id)?.full_name ?? "Bonita customer"}
                        </span>
                        <span>Payment: {order.payment_status}</span>
                        <span>Fulfillment: {order.fulfillment_status}</span>
                      </div>
                    </div>
                    <div className="space-y-2 lg:text-right">
                      <p className="text-xl font-semibold text-[var(--color-bonita-ivory)]">
                        {formatCurrency(Number(order.grand_total))}
                      </p>
                      <p className="text-sm text-white/65">
                        {new Date(order.created_at).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>
                </Surface>
              </Link>
            ))
          ) : (
            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <p className="text-sm text-white/60">No orders created yet.</p>
            </Surface>
          )}
        </div>
      </div>
    </main>
  );
}
