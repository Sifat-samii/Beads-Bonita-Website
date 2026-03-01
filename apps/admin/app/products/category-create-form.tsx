"use client";

import { useEffect, useState } from "react";
import { ErrorMessage } from "./error-message";
import { SlugInputField } from "./slug-input-field";

type CategoryCreateFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  errorMessage?: string;
  resetToken?: string;
};

const STORAGE_KEY = "bb-admin-category-create-form";

type CategoryDraft = {
  name: string;
  slug: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyDraft: CategoryDraft = {
  name: "",
  slug: "",
  sortOrder: "",
  isActive: true,
};

export function CategoryCreateForm({
  action,
  errorMessage,
  resetToken,
}: CategoryCreateFormProps) {
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!errorMessage) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      setDraft(JSON.parse(stored) as CategoryDraft);
      setFormVersion((current) => current + 1);
    } catch {
      setDraft(emptyDraft);
      setFormVersion((current) => current + 1);
    } finally {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (typeof window === "undefined" || !resetToken) {
      return;
    }

    setDraft(emptyDraft);
    setFormVersion((current) => current + 1);
    window.sessionStorage.removeItem(STORAGE_KEY);
    void fetch("/products/flash-error", {
      method: "POST",
      credentials: "same-origin",
    });
  }, [resetToken]);

  return (
    <form
      action={action}
      className="mt-6 space-y-4"
      key={formVersion}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);

        window.sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            name: String(formData.get("name") ?? ""),
            slug: String(formData.get("slug") ?? ""),
            sortOrder: String(formData.get("sortOrder") ?? ""),
            isActive: formData.get("isActive") === "on",
          } satisfies CategoryDraft),
        );
      }}
    >
      <ErrorMessage message={errorMessage} />
      <label className="block space-y-2 text-sm">
        <span>Name</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.name}
          name="name"
          required
          type="text"
        />
      </label>
      <SlugInputField defaultValue={draft.slug} label="Slug" name="slug" required />
      <label className="block space-y-2 text-sm">
        <span>Sort order</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          defaultValue={draft.sortOrder}
          min="0"
          name="sortOrder"
          required
          type="number"
        />
      </label>
      <label className="flex items-center gap-3 text-sm text-white/80">
        <input defaultChecked={draft.isActive} name="isActive" type="checkbox" />
        Active category
      </label>
      <button
        className="rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-charcoal)]"
        type="submit"
      >
        Add category
      </button>
    </form>
  );
}
