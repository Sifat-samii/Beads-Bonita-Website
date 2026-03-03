import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(255,255,255,0.82)] shadow-[0_18px_45px_rgba(34,27,20,0.07)] transition duration-300 hover:-translate-y-1 hover:bg-white"
      href={`/product/${product.slug}`}
    >
      <div className="relative aspect-[0.92] overflow-hidden bg-[linear-gradient(135deg,#edf4f0_0%,#dce8e0_42%,#f4ece1_100%)]">
        {product.primaryImageUrl ? (
          <Image
            alt={product.name}
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 30vw"
            src={product.primaryImageUrl}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,20,20,0.02),rgba(14,20,20,0.18))]" />
        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/92">
              {categoryName}
            </p>
            {subcategoryName ? (
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/68">
                {subcategoryName}
              </p>
            ) : null}
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/14 text-white backdrop-blur-md transition group-hover:bg-white/24">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        {badges.length ? (
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                className="rounded-full border border-white/55 bg-white/74 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
                key={badge}
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-[family-name:var(--font-display)] text-[2rem] leading-none tracking-[-0.03em] text-[var(--color-bonita-charcoal)]">
            {product.name}
          </h3>
          <div className="shrink-0 text-right">
            <p className="text-base font-semibold text-[var(--color-bonita-charcoal)]">
              {formatCurrency(product.price)}
            </p>
            {product.compareAtPrice ? (
              <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--color-bonita-charcoal)_38%,white)] line-through">
                {formatCurrency(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
        </div>

        <p className="text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
            {product.leadTimeDays
              ? `Lead time ${product.leadTimeDays} days`
              : "Ready to ship"}
          </p>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-moss)]">
            View product
          </span>
        </div>
      </div>
    </Link>
  );
}
