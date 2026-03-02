import { Bell, Heart, MapPinHouse, Package, Sparkles } from "lucide-react";
import { requireCustomer } from "@beads-bonita/supabase/auth";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";

export const dynamic = "force-dynamic";

const upcomingModules = [
  {
    label: "Order history",
    description: "A cleaner timeline of placed orders and status updates is the next customer-facing layer.",
    icon: Package,
  },
  {
    label: "Saved addresses",
    description: "Shipping details will move into reusable address records for faster repeat checkout.",
    icon: MapPinHouse,
  },
  {
    label: "Wishlist",
    description: "Saved pieces and future revisit flows will live here once the account stack is expanded.",
    icon: Heart,
  },
  {
    label: "Testimonials",
    description: "Authenticated customer stories and product-linked submissions will connect here later.",
    icon: Sparkles,
  },
];

export default async function AccountPage() {
  const { profile, user } = await requireCustomer();

  return (
    <StorefrontFrame currentPath="/account">
      <div className="grid gap-6 pt-4 lg:grid-cols-[0.72fr_1.28fr]">
        <Surface className="overflow-hidden border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(241,232,220,0.86))] p-0">
          <div className="relative overflow-hidden p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,143,120,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(211,180,167,0.22),transparent_30%)]" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--color-bonita-moss)]">
                Account overview
              </p>
              <h1 className="mt-5 max-w-sm font-[family-name:var(--font-display)] text-5xl leading-[0.96] text-[var(--color-bonita-charcoal)]">
                Hello, {profile.full_name ?? "Bonita customer"}.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-8 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
                Your account foundation is active and connected to Supabase authentication.
                This area now acts as the premium shell for the next member tools.
              </p>

              <div className="mt-10 rounded-[1.8rem] border border-white/55 bg-white/55 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bonita-charcoal)] text-lg font-semibold text-[var(--color-bonita-ivory)]">
                    {(profile.full_name ?? user.email ?? "B").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--color-bonita-charcoal)]">
                      {profile.full_name ?? "Bonita customer"}
                    </p>
                    <p className="text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_58%,white)]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 rounded-full bg-[rgba(30,23,18,0.04)] px-4 py-3 text-sm text-[var(--color-bonita-charcoal)]">
                  <Bell className="size-4 text-[var(--color-bonita-moss)]" />
                  Member tools are being rolled into this space next.
                </div>
              </div>
            </div>
          </div>
        </Surface>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Surface className="border-white/40 bg-white/68 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-bonita-moss)]">
                Email
              </p>
              <p className="mt-4 text-lg font-semibold text-[var(--color-bonita-charcoal)]">
                {user.email}
              </p>
            </Surface>
            <Surface className="border-white/40 bg-white/68 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-bonita-moss)]">
                Role
              </p>
              <p className="mt-4 text-lg font-semibold capitalize text-[var(--color-bonita-charcoal)]">
                {profile.role}
              </p>
            </Surface>
            <Surface className="border-white/40 bg-white/68 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-bonita-moss)]">
                Marketing
              </p>
              <p className="mt-4 text-lg font-semibold text-[var(--color-bonita-charcoal)]">
                {profile.marketing_consent ? "Opted in" : "Not set"}
              </p>
            </Surface>
          </div>

          <Surface className="border-white/40 bg-white/68 p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
                  Member roadmap
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
                  The next customer tools plug in here.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                The structure is ready. The next build slices will connect real customer data to this dashboard.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {upcomingModules.map((module) => {
                const Icon = module.icon;

                return (
                  <div
                    className="rounded-[1.7rem] border border-white/55 bg-[rgba(255,255,255,0.62)] p-5"
                    key={module.label}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(30,23,18,0.05)]">
                      <Icon className="size-5 text-[var(--color-bonita-cocoa)]" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[var(--color-bonita-charcoal)]">
                      {module.label}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                      {module.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Surface>

          <Surface className="border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(239,231,219,0.84))] p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
                  Session
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
                  Signed in and ready.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_68%,white)]">
                  You can safely continue shopping now. As the account layer expands, this page will become the center of your member experience.
                </p>
              </div>
              <form action="/auth/logout" method="post">
                <button
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[var(--color-bonita-charcoal)] px-7 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-bonita-ivory)] transition hover:bg-[color-mix(in_srgb,var(--color-bonita-charcoal)_90%,black)]"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </div>
          </Surface>
        </div>
      </div>
    </StorefrontFrame>
  );
}
