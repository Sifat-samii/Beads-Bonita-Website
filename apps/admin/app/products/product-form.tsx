"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteProductButton } from "./delete-product-button";
import { ErrorMessage } from "./error-message";
import { ProductCategorySubcategoryFields } from "./product-category-subcategory-fields";
import { ProductIdentityFields } from "./product-identity-fields";

type CategoryOption = {
  id: string;
  name: string;
};

type SubcategoryOption = {
  id: string;
  categoryId: string;
  name: string;
};

type ProductDraft = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  status: string;
  productType: string;
  price: string;
  compareAtPrice: string;
  leadTimeDays: string;
  stockQuantity: string;
  lowStockThreshold: string;
  story: string;
  sustainabilityInfo: string;
  careInstructions: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
};

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  defaultValues: ProductDraft;
  errorMessage?: string;
  resetToken?: string;
  storageKey: string;
  productId?: string;
  cancelHref?: string;
  deleteAction?: () => Promise<void>;
  deleteProductName?: string;
};

export function ProductForm({
  action,
  buttonLabel,
  categories,
  subcategories,
  defaultValues,
  errorMessage,
  resetToken,
  storageKey,
  productId,
  cancelHref,
  deleteAction,
  deleteProductName,
}: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(defaultValues);
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!errorMessage) {
      window.sessionStorage.removeItem(storageKey);
      return;
    }

    const stored = window.sessionStorage.getItem(storageKey);
    if (!stored) {
      return;
    }

    try {
      setDraft(JSON.parse(stored) as ProductDraft);
      setFormVersion((current) => current + 1);
    } catch {
      setDraft(defaultValues);
      setFormVersion((current) => current + 1);
    } finally {
      window.sessionStorage.removeItem(storageKey);
    }
  }, [defaultValues, errorMessage, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !resetToken) {
      return;
    }

    setDraft(defaultValues);
    setFormVersion((current) => current + 1);
    window.sessionStorage.removeItem(storageKey);
    void fetch("/products/flash-error", {
      method: "POST",
      credentials: "same-origin",
    });
  }, [defaultValues, resetToken, storageKey]);

  return (
    <form
      action={action}
      className="mt-6 grid gap-4 md:grid-cols-2"
      key={formVersion}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);

        window.sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            name: String(formData.get("name") ?? ""),
            slug: String(formData.get("slug") ?? ""),
            sku: String(formData.get("sku") ?? ""),
            shortDescription: String(formData.get("shortDescription") ?? ""),
            description: String(formData.get("description") ?? ""),
            categoryId: String(formData.get("categoryId") ?? ""),
            subcategoryId: String(formData.get("subcategoryId") ?? ""),
            status: String(formData.get("status") ?? ""),
            productType: String(formData.get("productType") ?? ""),
            price: String(formData.get("price") ?? ""),
            compareAtPrice: String(formData.get("compareAtPrice") ?? ""),
            leadTimeDays: String(formData.get("leadTimeDays") ?? ""),
            stockQuantity: String(formData.get("stockQuantity") ?? ""),
            lowStockThreshold: String(formData.get("lowStockThreshold") ?? ""),
            story: String(formData.get("story") ?? ""),
            sustainabilityInfo: String(formData.get("sustainabilityInfo") ?? ""),
            careInstructions: String(formData.get("careInstructions") ?? ""),
            isFeatured: formData.get("isFeatured") === "on",
            isBestSeller: formData.get("isBestSeller") === "on",
            isLimitedEdition: formData.get("isLimitedEdition") === "on",
          } satisfies ProductDraft),
        );
      }}
    >
      <div className="md:col-span-2">
        <ErrorMessage message={errorMessage} />
      </div>
      <ProductIdentityFields
        name={draft.name}
        onNameChange={(value) => setDraft((current) => ({ ...current, name: value }))}
        onSkuChange={(value) => setDraft((current) => ({ ...current, sku: value }))}
        onSlugChange={(value) => setDraft((current) => ({ ...current, slug: value }))}
        productId={productId}
        sku={draft.sku}
        slug={draft.slug}
      />
      <label className="block space-y-2 text-sm md:col-span-2">
        <span>Short description</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.shortDescription}
          name="shortDescription"
          required
          type="text"
        />
      </label>
      <label className="block space-y-2 text-sm md:col-span-2">
        <span>Description</span>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.description}
          name="description"
          required
        />
      </label>
      <ProductCategorySubcategoryFields
        categories={categories}
        selectedCategoryId={draft.categoryId}
        onCategoryChange={(value) =>
          setDraft((current) => ({ ...current, categoryId: value, subcategoryId: "" }))
        }
        onSubcategoryChange={(value) =>
          setDraft((current) => ({ ...current, subcategoryId: value }))
        }
        subcategories={subcategories}
        selectedSubcategoryId={draft.subcategoryId}
      />
      <label className="block space-y-2 text-sm">
        <span>Status</span>
        <select
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.status}
          name="status"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm">
        <span>Product type</span>
        <select
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.productType}
          name="productType"
        >
          <option value="ready_stock">Ready stock</option>
          <option value="made_to_order">Made to order</option>
          <option value="custom_request_enabled">Custom request enabled</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm">
        <span>Price</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.price}
          min="0"
          name="price"
          required
          step="0.01"
          type="number"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Compare at price</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.compareAtPrice}
          min="0"
          name="compareAtPrice"
          step="0.01"
          type="number"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Lead time (days)</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.leadTimeDays}
          min="0"
          name="leadTimeDays"
          type="number"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Stock quantity</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.stockQuantity}
          min="0"
          name="stockQuantity"
          required
          type="number"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Low stock threshold</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.lowStockThreshold}
          min="0"
          name="lowStockThreshold"
          required
          type="number"
        />
      </label>
      <label className="block space-y-2 text-sm md:col-span-2">
        <span>Story</span>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.story}
          name="story"
        />
      </label>
      <label className="block space-y-2 text-sm md:col-span-2">
        <span>Sustainability info</span>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.sustainabilityInfo}
          name="sustainabilityInfo"
        />
      </label>
      <label className="block space-y-2 text-sm md:col-span-2">
        <span>Care instructions</span>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.careInstructions}
          name="careInstructions"
        />
      </label>
      <div className="flex flex-wrap gap-4 md:col-span-2">
        <label className="flex items-center gap-3 text-sm text-white/80">
          <input defaultChecked={draft.isFeatured} name="isFeatured" type="checkbox" />
          Featured
        </label>
        <label className="flex items-center gap-3 text-sm text-white/80">
          <input defaultChecked={draft.isBestSeller} name="isBestSeller" type="checkbox" />
          Best seller
        </label>
        <label className="flex items-center gap-3 text-sm text-white/80">
          <input
            defaultChecked={draft.isLimitedEdition}
            name="isLimitedEdition"
            type="checkbox"
          />
          Limited edition
        </label>
      </div>
      <div className="md:col-span-2">
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
            type="submit"
          >
            {buttonLabel}
          </button>
          {cancelHref ? (
            <Link
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-ivory)]"
              href={cancelHref}
            >
              Cancel edit
            </Link>
          ) : null}
          {deleteAction && deleteProductName ? (
            <DeleteProductButton action={deleteAction} productName={deleteProductName} />
          ) : null}
        </div>
      </div>
    </form>
  );
}

export type { ProductDraft };
