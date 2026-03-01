import { adminNavigation } from "@beads-bonita/core";
import { SectionHeading } from "@beads-bonita/ui/section-heading";
import { Surface } from "@beads-bonita/ui/surface";
import { Activity, Boxes, MessageSquareQuote, PackageSearch, Users } from "lucide-react";

const metrics = [
  { label: "Revenue", value: "SQL view scaffolded" },
  { label: "Orders", value: "Status timeline ready" },
  { label: "Inventory", value: "Adjustment log planned" },
  { label: "Testimonials", value: "Moderation flow mapped" },
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-6 py-6 md:px-8">
      <aside className="hidden w-72 shrink-0 flex-col rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-bonita-rose)]">
            BEADS BONITA
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-ivory)]">
            Admin
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Lean Supabase-first control center for catalog, orders, customers,
            and operational insight.
          </p>
        </div>

        <nav className="mt-10 space-y-2">
          {adminNavigation.map((item) => (
            <a
              className="block rounded-full border border-white/10 px-4 py-3 text-sm text-white/85 transition hover:bg-white/8"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1 space-y-6">
        <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
          <SectionHeading
            eyebrow="Foundation status"
            title="The admin workspace is aligned to the approved operating model."
            description="This shell sets the direction for KPI monitoring, product CRUD, order management, inventory control, customer records, and testimonial moderation."
          />
        </Surface>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Surface
              className="border-white/10 bg-white/8 p-5 text-white shadow-none"
              key={metric.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-rose)]">
                {metric.label}
              </p>
              <p className="mt-3 text-xl font-semibold text-[var(--color-bonita-ivory)]">
                {metric.value}
              </p>
            </Surface>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
            <div className="flex items-center gap-3">
              <PackageSearch className="size-5 text-[var(--color-bonita-rose)]" />
              <h2 className="text-lg font-semibold">Commerce modules</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm font-semibold">Products</p>
                <p className="mt-2 text-sm text-white/65">
                  CRUD, categories, media, SEO, status, and flags.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm font-semibold">Orders</p>
                <p className="mt-2 text-sm text-white/65">
                  Timeline, payment verification, courier tracking, notes.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm font-semibold">Inventory</p>
                <p className="mt-2 text-sm text-white/65">
                  Low-stock thresholds and adjustment audit trail.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm font-semibold">Customers</p>
                <p className="mt-2 text-sm text-white/65">
                  Profiles, addresses, order history, notes, and tags.
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="border-white/10 bg-white/8 p-6 text-white shadow-none">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Activity className="size-5 text-[var(--color-bonita-moss)]" />
                <h2 className="text-lg font-semibold">Operational focus</h2>
              </div>
              <ul className="space-y-4 text-sm leading-7 text-white/70">
                <li className="flex gap-3">
                  <Boxes className="mt-1 size-4 shrink-0 text-[var(--color-bonita-rose)]" />
                  SQL views will power lean KPI cards before any heavier analytics stack is introduced.
                </li>
                <li className="flex gap-3">
                  <MessageSquareQuote className="mt-1 size-4 shrink-0 text-[var(--color-bonita-moss)]" />
                  Testimonials remain moderated and tied to authenticated customers only.
                </li>
                <li className="flex gap-3">
                  <Users className="mt-1 size-4 shrink-0 text-[var(--color-bonita-clay)]" />
                  RLS remains strict, while sensitive admin operations run through secure server flows.
                </li>
              </ul>
            </div>
          </Surface>
        </section>
      </div>
    </main>
  );
}
