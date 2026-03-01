"use client";

import { useEffect, useId, useRef, useState } from "react";

type ProductIdentityFieldsProps = {
  name: string;
  slug: string;
  sku: string;
  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  productId?: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ValidationState = {
  nameExists: boolean;
  slugExists: boolean;
  skuExists: boolean;
};

const initialValidationState: ValidationState = {
  nameExists: false,
  slugExists: false,
  skuExists: false,
};

export function ProductIdentityFields({
  name,
  slug,
  sku,
  onNameChange,
  onSlugChange,
  onSkuChange,
  productId,
}: ProductIdentityFieldsProps) {
  const [validation, setValidation] = useState(initialValidationState);
  const nameId = useId();
  const slugId = useId();
  const skuId = useId();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null);
  const skuRef = useRef<HTMLInputElement | null>(null);

  const hasSlugUppercase = slug !== slug.toLowerCase();
  const hasInvalidSlugFormat = slug.length > 0 && !slugPattern.test(slug);
  const slugFormatWarning = hasSlugUppercase
    ? "Slug must be lowercase only."
    : hasInvalidSlugFormat
      ? "Slug can use lowercase letters, numbers, and hyphens only."
      : "";

  useEffect(() => {
    const normalizedName = name.trim();
    const normalizedSlug = slug.trim();
    const normalizedSku = sku.trim();
    const shouldCheckName = normalizedName.length >= 2;
    const shouldCheckSlug = normalizedSlug.length >= 2 && !slugFormatWarning;
    const shouldCheckSku = normalizedSku.length >= 2;

    if (!shouldCheckName && !shouldCheckSlug && !shouldCheckSku) {
      setValidation(initialValidationState);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams();

      if (shouldCheckName) {
        params.set("name", normalizedName);
      }

      if (shouldCheckSlug) {
        params.set("slug", normalizedSlug);
      }

      if (shouldCheckSku) {
        params.set("sku", normalizedSku);
      }

      if (productId) {
        params.set("excludeProductId", productId);
      }

      try {
        const response = await fetch(`/products/validate?${params.toString()}`, {
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ValidationState;
        setValidation({
          nameExists: shouldCheckName ? payload.nameExists : false,
          slugExists: shouldCheckSlug ? payload.slugExists : false,
          skuExists: shouldCheckSku ? payload.skuExists : false,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setValidation(initialValidationState);
        }
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [name, slug, sku, productId, slugFormatWarning]);

  useEffect(() => {
    if (!nameRef.current || !slugRef.current || !skuRef.current) {
      return;
    }

    nameRef.current.setCustomValidity(
      validation.nameExists ? `Product name "${name.trim()}" already exists.` : "",
    );
    slugRef.current.setCustomValidity(
      slugFormatWarning
        ? slugFormatWarning
        : validation.slugExists
          ? `Product slug "${slug.trim()}" already exists.`
          : "",
    );
    skuRef.current.setCustomValidity(
      validation.skuExists ? `SKU "${sku.trim()}" already exists.` : "",
    );
  }, [name, slug, sku, slugFormatWarning, validation]);

  return (
    <>
      <label className="block space-y-2 text-sm md:col-span-2">
        <span>Name</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          id={nameId}
          name="name"
          onChange={(event) => onNameChange(event.target.value)}
          ref={nameRef}
          required
          type="text"
          value={name}
        />
        {validation.nameExists ? (
          <p className="text-xs text-rose-100">{`Product name "${name.trim()}" already exists.`}</p>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm">
        <span>Slug</span>
        <input
          autoCapitalize="none"
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          id={slugId}
          name="slug"
          onChange={(event) => onSlugChange(event.target.value)}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          ref={slugRef}
          required
          spellCheck={false}
          type="text"
          value={slug}
        />
        {slugFormatWarning ? (
          <p className="text-xs text-rose-100">{slugFormatWarning}</p>
        ) : validation.slugExists ? (
          <p className="text-xs text-rose-100">{`Product slug "${slug.trim()}" already exists.`}</p>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm">
        <span>SKU</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          id={skuId}
          name="sku"
          onChange={(event) => onSkuChange(event.target.value)}
          ref={skuRef}
          required
          type="text"
          value={sku}
        />
        {validation.skuExists ? (
          <p className="text-xs text-rose-100">{`SKU "${sku.trim()}" already exists.`}</p>
        ) : null}
      </label>
    </>
  );
}
