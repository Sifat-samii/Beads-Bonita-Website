"use client";

import Image from "next/image";
import Link from "next/link";
import type { StoreProductCard } from "../_lib/catalog";
import { formatCurrency } from "../_lib/catalog-display";
import { AddToCartButton } from "../product/[slug]/add-to-cart-button";

export function ShopProductTile({
  categoryName,
  product,
  subcategoryName,
}: {
  categoryName: string;
  product: StoreProductCard;
  subcategoryName?: string;
}) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        className="relative flex aspect-[0.9] items-end overflow-hidden rounded-[1.5rem] bg-[#f2f0eb]"
        href={`/product/${product.slug}`}
      >
        {product.primaryImageUrl ? (
          <Image
            alt={product.name}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={product.primaryImageUrl}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_26%),linear-gradient(135deg,#edf4f0_0%,#dce8e0_45%,#f4ece1_100%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,22,22,0.02),rgba(18,22,22,0.08))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.isBestSeller ? (
            <span className="rounded-full bg-white/86 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-charcoal)]">
              Best seller
            </span>
          ) : null}
          {product.isLimitedEdition ? (
            <span className="rounded-full bg-white/86 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-bonita-charcoal)]">
              Limited
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-1 pb-1 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-clay)]">
            {categoryName}
            {subcategoryName ? ` / ${subcategoryName}` : ""}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="mt-2 text-[1.15rem] font-medium leading-7 text-[var(--color-bonita-charcoal)]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-[1.7rem] font-semibold leading-none text-[var(--color-bonita-charcoal)]">
            {formatCurrency(product.price)}
          </p>
          {product.compareAtPrice ? (
            <p className="text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_38%,white)] line-through">
              {formatCurrency(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)]">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-1">
          <AddToCartButton
            item={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              categoryName,
              subcategoryName,
              shortDescription: product.shortDescription,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              productType: product.productType,
              leadTimeDays: product.leadTimeDays,
            }}
          />
        </div>
      </div>
    </article>
  );
}
