import {
  Bell,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Search,
  Settings2,
  ShoppingBag,
  Star,
  WalletCards,
} from "lucide-react";
import { requireCustomer } from "@beads-bonita/supabase/auth";
import { Surface } from "@beads-bonita/ui/surface";
import { StorefrontFrame } from "../_components/storefront-frame";

export const dynamic = "force-dynamic";

const accountNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Orders", icon: Package },
  { label: "Addresses", icon: MapPin },
  { label: "Wishlist", icon: Heart },
  { label: "Reviews", icon: Star },
  { label: "Profile Settings", icon: Settings2 },
];

const stats = [
  {
    label: "Total Orders",
    value: "12",
    icon: ShoppingBag,
    iconClass: "bg-[rgba(127,143,120,0.16)] text-[var(--color-bonita-moss)]",
  },
  {
    label: "Pending Orders",
    value: "2",
    icon: Bell,
    iconClass: "bg-[rgba(107,78,58,0.12)] text-[var(--color-bonita-cocoa)]",
  },
  {
    label: "Wishlist Items",
    value: "8",
    icon: Heart,
    iconClass: "bg-[rgba(192,124,124,0.12)] text-[#c76e78]",
  },
  {
    label: "Reward Points",
    value: "450",
    icon: Star,
    iconClass: "bg-[rgba(214,191,118,0.18)] text-[#b39018]",
  },
];

const orders = [
  {
    id: "#BO2024001",
    date: "March 15, 2024",
    amount: "$89.99",
    payment: "Paid",
    status: "Shipped",
    thumb: "from-[#252a35] via-[#7a6838] to-[#9eb063]",
  },
  {
    id: "#BO2024002",
    date: "March 20, 2024",
    amount: "$156.50",
    payment: "Paid",
    status: "Processing",
    thumb: "from-[#faf7f0] via-[#ebe3d8] to-[#b7a694]",
  },
];

const wishlist = [
  {
    name: "Turquoise Drop Earrings",
    price: "$45.00",
    art: "from-[#0d1115] via-[#2a424f] to-[#5bb5c6]",
  },
  {
    name: "Silver Band Ring",
    price: "$78.00",
    art: "from-[#ece9e4] via-[#cfcac4] to-[#8e877e]",
  },
  {
    name: "Amber Pendant",
    price: "$92.00",
    art: "from-[#f7f3e8] via-[#f1c04e] to-[#a25113]",
  },
];

export default async function AccountPage() {
  const { profile, user } = await requireCustomer();

  const displayName = profile.full_name ?? "Sarah Chen";
  const shortName = displayName.split(" ")[0] ?? displayName;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <StorefrontFrame contentClassName="flex w-full flex-col gap-8" currentPath="/account">
      <div className="pb-6 pt-2">
        <Surface className="overflow-hidden border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(241,232,220,0.84))] p-0 shadow-[0_24px_70px_rgba(65,48,33,0.08)]">
          <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-b border-black/5 bg-[rgba(255,255,255,0.55)] px-5 py-6 lg:min-h-[1340px] lg:border-b-0 lg:border-r">
              <div className="px-2">
                <p className="text-[15px] font-medium text-[var(--color-bonita-moss)]">Beads Bonita</p>
              </div>

              <nav className="mt-10 space-y-2">
                {accountNav.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      className={`flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[15px] transition ${
                        item.active
                          ? "bg-[rgba(127,143,120,0.14)] text-[var(--color-bonita-charcoal)] shadow-[inset_4px_0_0_var(--color-bonita-moss)]"
                          : "text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)] hover:bg-white/55"
                      }`}
                      key={item.label}
                      type="button"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <form action="/auth/logout" className="mt-6" method="post">
                <button
                  className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[15px] text-[var(--color-bonita-cocoa)] transition hover:bg-white/55"
                  type="submit"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </form>
            </aside>

            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(241,232,220,0.22))] p-4 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-4 border-b border-black/5 bg-[rgba(255,255,255,0.34)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="relative w-full max-w-[320px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_44%,white)]" />
                  <input
                    aria-label="Search jewelry"
                    className="h-11 w-full rounded-[14px] border border-white/65 bg-white/72 pl-11 pr-4 text-sm text-[var(--color-bonita-charcoal)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-bonita-charcoal)_42%,white)]"
                    placeholder="Search jewelry..."
                    type="search"
                  />
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button className="relative text-[var(--color-bonita-cocoa)]" type="button">
                    <Heart className="size-5" />
                    <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-bonita-moss)] px-1 text-[10px] font-semibold text-white">
                      3
                    </span>
                  </button>
                  <button className="relative text-[var(--color-bonita-cocoa)]" type="button">
                    <WalletCards className="size-5" />
                    <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-bonita-moss)] px-1 text-[10px] font-semibold text-white">
                      2
                    </span>
                  </button>
                  <div className="flex items-center gap-3 rounded-full pl-2 pr-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(127,143,120,0.22),rgba(211,180,167,0.26))] text-sm font-semibold text-[var(--color-bonita-charcoal)]">
                      {initial}
                    </div>
                    <p className="text-[15px] font-medium text-[var(--color-bonita-charcoal)]">{displayName}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-7">
                <section className="rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(241,232,220,0.82))] px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:px-7">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h1 className="text-[34px] font-medium tracking-[-0.03em] text-[var(--color-bonita-charcoal)] sm:text-[46px]">
                        Welcome back, {shortName}
                      </h1>
                      <p className="mt-2 text-[15px] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_52%,white)]">
                        Here&apos;s a summary of your account
                      </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(211,180,167,0.34))] text-lg font-semibold text-[var(--color-bonita-charcoal)] shadow-[0_10px_25px_rgba(76,56,40,0.15)]">
                      {initial}
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        className="rounded-[18px] border border-white/65 bg-white/78 px-5 py-5 shadow-[0_8px_25px_rgba(59,43,30,0.04)]"
                        key={stat.label}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[18px] font-semibold text-[var(--color-bonita-charcoal)]">{stat.value}</p>
                            <p className="mt-1 text-[14px] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_48%,white)]">
                              {stat.label}
                            </p>
                          </div>
                          <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${stat.iconClass}`}>
                            <Icon className="size-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>

                <section>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[22px] font-medium text-[var(--color-bonita-charcoal)]">Recent Orders</h2>
                    <button className="text-[15px] text-[var(--color-bonita-moss)]" type="button">
                      View All
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {orders.map((order) => (
                      <div
                        className="flex flex-col gap-5 rounded-[18px] border border-white/65 bg-white/78 px-5 py-5 shadow-[0_8px_25px_rgba(59,43,30,0.04)] lg:flex-row lg:items-center lg:justify-between"
                        key={order.id}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-14 w-14 rounded-[12px] bg-gradient-to-br ${order.thumb}`} />
                          <div>
                            <p className="text-[15px] font-semibold text-[var(--color-bonita-charcoal)]">{order.id}</p>
                            <p className="mt-1 text-[14px] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_48%,white)]">
                              {order.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-[15px]">
                          <span className="font-semibold text-[var(--color-bonita-charcoal)]">{order.amount}</span>
                          <span className="text-[var(--color-bonita-moss)]">{order.payment}</span>
                          <span className={order.status === "Shipped" ? "text-[#617dde]" : "text-[var(--color-bonita-cocoa)]"}>
                            {order.status}
                          </span>
                          <button className="text-[var(--color-bonita-moss)]" type="button">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[22px] font-medium text-[var(--color-bonita-charcoal)]">Saved Addresses</h2>
                    <button
                      className="rounded-[14px] bg-[var(--color-bonita-moss)] px-5 py-2.5 text-[15px] font-medium text-white"
                      type="button"
                    >
                      Add New Address
                    </button>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-white/65 bg-white/78 px-5 py-5 shadow-[0_8px_25px_rgba(59,43,30,0.04)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(127,143,120,0.12)] text-[var(--color-bonita-moss)]">
                          <MapPin className="size-5" />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-[var(--color-bonita-charcoal)]">Home Address</p>
                          <p className="mt-1 text-[14px] leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_48%,white)]">
                            123 Artisan Street<br />
                            Brooklyn, NY 11201<br />
                            United States
                          </p>
                        </div>
                      </div>
                      <button className="text-[15px] text-[var(--color-bonita-moss)]" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[22px] font-medium text-[var(--color-bonita-charcoal)]">Your Wishlist</h2>
                    <button className="text-[15px] text-[var(--color-bonita-moss)]" type="button">
                      View All
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {wishlist.map((item) => (
                      <div
                        className="rounded-[18px] border border-white/65 bg-white/8? p-4 shadow-[0_8px_25px_rgba(59,43,30,0.04)]"
                        key={item.name}
                      >
                        <div className={`h-36 rounded-[14px] bg-gradient-to-br ${item.art}`} />
                        <div className="mt-4">
                          <p className="text-[16px] font-medium text-[var(--color-bonita-charcoal)]">{item.name}</p>
                          <p className="mt-1 text-[15px] font-semibold text-[var(--color-bonita-moss)]">{item.price}</p>
                        </div>
                        <button
                          className="mt-4 h-11 w-full rounded-[14px] bg-[var(--color-bonita-moss)] text-[15px] font-medium text-white"
                          type="button"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[22px] font-medium text-[var(--color-bonita-charcoal)]">Your Reviews</h2>
                    <button
                      className="rounded-[14px] bg-[var(--color-bonita-cocoa)] px-5 py-2.5 text-[15px] font-medium text-white"
                      type="button"
                    >
                      Write a Review
                    </button>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-white/65 bg-white/78 px-5 py-5 shadow-[0_8px_25px_rgba(59,43,30,0.04)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[16px] font-semibold text-[var(--color-bonita-charcoal)]">Pearl Drop Earrings</p>
                        <div className="mt-2 flex gap-1 text-[#deb31f]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star className="size-4 fill-current" key={index} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[15px] text-[var(--color-bonita-moss)]">Approved</span>
                    </div>
                    <p className="mt-5 text-[14px] leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_48%,white)]">
                      Beautiful craftsmanship and elegant design. The pearls have a lovely luster and the earrings are very comfortable to wear...
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Surface>
      </div>
    </StorefrontFrame>
  );
}

