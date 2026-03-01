import Link from "next/link";
import { Surface } from "@beads-bonita/ui/surface";
import { type StoreProductCard } from "../_lib/catalog";
import { formatCurrency, getProductBadges } from "../_lib/catalog-display";

export function ProductCard({
  categoryName,
  product,
  subcategoryName,
}: {
  categoryName: string;
  product: StoreProductCard;
  subcategoryName?: string;
}) {
  const badges = getProductBadges(product).slice(0, 2);

  return (
    <Link href={`/product/${product.slug}`}>
      <Surface className="group h-full border-white/40 bg-white/65 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/78">
        <div className="flex h-56 items-end rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(211,180,167,0.26),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.85),rgba(236,223,208,0.7))] p-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-moss)]">
              {categoryName}
              {subcategoryName ? ` / ${subcategoryName}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
                  key={badge}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3 px-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-3xl leading-none text-[var(--color-bonita-charcoal)]">
                {product.name}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[var(--color-bonita-charcoal)]">
                {formatCurrency(product.price)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-xs text-white/55 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            {product.shortDescription}
          </p>
          {product.leadTimeDays ? (
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
              Lead time {product.leadTimeDays} days
            </p>
          ) : null}
        </div>
      </Surface>
    </Link>
  );
}
