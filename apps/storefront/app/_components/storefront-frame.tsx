import { brand } from "@beads-bonita/core";
import { HomeTopChrome } from "./home-top-chrome";
import { StorefrontFooter } from "./storefront-footer";
import { getHomeChromeData } from "../_lib/home-chrome";

export async function StorefrontFrame({
  children,
  contentClassName,
  currentPath: _currentPath,
}: {
  children: React.ReactNode;
  contentClassName?: string;
  currentPath: string;
}) {
  const { navItems, announcementSlides } = await getHomeChromeData();

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[var(--color-bonita-charcoal)]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#edf4f0_0%,#f7f3ed_25%,#f7f3ed_100%)]">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(157,203,193,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(211,180,167,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.6),transparent_62%)]" />
        <HomeTopChrome
          brandName={brand.name}
          items={navItems}
          slides={announcementSlides}
        />

        <div className="relative z-10 px-6 pb-16 pt-[9.75rem] sm:px-10 lg:px-16 lg:pb-24 lg:pt-[10.75rem]">
          <div
            className={
              contentClassName ??
              "mx-auto flex w-full max-w-[1540px] flex-col gap-8"
            }
          >
            {children}
          </div>
        </div>
      </div>

      <StorefrontFooter />
    </main>
  );
}
