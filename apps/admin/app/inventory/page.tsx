import { requireAdmin } from "@beads-bonita/supabase/auth";
import { getSupabaseAdminClient } from "@beads-bonita/supabase/server";
import { Surface } from "@beads-bonita/ui/surface";
import { adjustInventoryAction } from "../products/actions";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const { profile } = await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const [{ data: inventory }, { data: products }] = await Promise.all([
    supabase
      .from("inventory_stock")
      .select("id, product_id, quantity, low_stock_threshold, updated_at")
      .not("product_id", "is", null)
      .order("updated_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, name, slug, status")
      .is("deleted_at", null),
  ]);

  const productMap = new Map(products?.map((product) => [product.id, product]) ?? []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 md:px-8">
      <div className="space-y-8">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-rose)]">
            Inventory management
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-ivory)]">
            Stock visibility and manual adjustments
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            This view surfaces product stock levels and supports safe manual
            adjustments with audit-log reasons.
          </p>
        </Surface>

        <div className="grid gap-4">
          {inventory?.length ? (
            inventory.map((row) => {
              const product = row.product_id ? productMap.get(row.product_id) : null;
              const isLow = row.quantity <= row.low_stock_threshold;

              return (
                <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none" key={row.id}>
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                        {isLow ? "Low stock" : "In stock"}
                      </p>
                      <h2 className="mt-3 text-xl font-semibold text-[var(--color-bonita-ivory)]">
                        {product?.name ?? "Unknown product"}
                      </h2>
                      <p className="mt-2 text-sm text-white/60">{product?.slug ?? "No slug"}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/75">
                        <span>Quantity: {row.quantity}</span>
                        <span>Low threshold: {row.low_stock_threshold}</span>
                        <span>Status: {product?.status ?? "Unknown"}</span>
                      </div>
                    </div>

                    <form action={adjustInventoryAction} className="grid min-w-80 gap-3">
                      <input name="inventoryId" type="hidden" value={row.id} />
                      <input name="productId" type="hidden" value={row.product_id ?? ""} />
                      <input name="adminId" type="hidden" value={profile.id} />
                      <label className="block space-y-2 text-sm">
                        <span>Adjustment delta</span>
                        <input
                          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                          name="delta"
                          placeholder="Use positive or negative number"
                          required
                          type="number"
                        />
                      </label>
                      <label className="block space-y-2 text-sm">
                        <span>Reason</span>
                        <input
                          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                          name="reason"
                          placeholder="Restock, correction, damaged item"
                          required
                          type="text"
                        />
                      </label>
                      <button
                        className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
                        type="submit"
                      >
                        Update stock
                      </button>
                    </form>
                  </div>
                </Surface>
              );
            })
          ) : (
            <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
              <p className="text-sm text-white/60">No inventory rows available yet.</p>
            </Surface>
          )}
        </div>
      </div>
    </main>
  );
}
