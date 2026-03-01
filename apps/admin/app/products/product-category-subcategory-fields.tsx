"use client";

import { useEffect, useId, useMemo } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type SubcategoryOption = {
  id: string;
  categoryId: string;
  name: string;
};

type ProductCategorySubcategoryFieldsProps = {
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  selectedCategoryId: string;
  selectedSubcategoryId: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
};

export function ProductCategorySubcategoryFields({
  categories,
  subcategories,
  selectedCategoryId,
  selectedSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: ProductCategorySubcategoryFieldsProps) {
  const categoryInputId = useId();
  const subcategoryInputId = useId();
  const filteredSubcategories = useMemo(
    () =>
      selectedCategoryId
        ? subcategories.filter((subcategory) => subcategory.categoryId === selectedCategoryId)
        : [],
    [selectedCategoryId, subcategories],
  );

  useEffect(() => {
    if (!selectedSubcategoryId) {
      return;
    }

    if (!selectedCategoryId) {
      onSubcategoryChange("");
      return;
    }

    const subcategoryStillMatches = filteredSubcategories.some(
      (subcategory) => subcategory.id === selectedSubcategoryId,
    );

    if (!subcategoryStillMatches) {
      onSubcategoryChange("");
    }
  }, [
    filteredSubcategories,
    onSubcategoryChange,
    selectedCategoryId,
    selectedSubcategoryId,
  ]);

  return (
    <>
      <label className="block space-y-2 text-sm">
        <span>Category</span>
        <select
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
          id={categoryInputId}
          name="categoryId"
          onChange={(event) => onCategoryChange(event.target.value)}
          required
          value={selectedCategoryId}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm">
        <span>Subcategory</span>
        <select
          className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedCategoryId}
          id={subcategoryInputId}
          name="subcategoryId"
          onChange={(event) => onSubcategoryChange(event.target.value)}
          required
          value={selectedSubcategoryId}
        >
          <option value="">
            {selectedCategoryId ? "Select subcategory" : "Select category first"}
          </option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
