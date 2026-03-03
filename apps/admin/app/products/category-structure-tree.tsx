"use client";

import { useState } from "react";
import { CategoryOptionsMenu } from "./category-options-menu";
import { SubcategoryOptionsMenu } from "./subcategory-options-menu";

type CategoryNode = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  subcategoryCount: number;
  subcategories: {
    id: string;
    name: string;
    sortOrder: number;
    isActive: boolean;
    isHiddenByParent: boolean;
    productCount: number;
  }[];
};

type CategoryStructureTreeProps = {
  categories: CategoryNode[];
  onDeleteCategory: (categoryId: string) => void | Promise<void>;
  onToggleCategoryStatus: (
    categoryId: string,
    nextIsActive: boolean,
  ) => void | Promise<void>;
  onDeleteSubcategory: (subcategoryId: string) => void | Promise<void>;
  onToggleSubcategoryStatus: (
    subcategoryId: string,
    nextIsActive: boolean,
  ) => void | Promise<void>;
};

export function CategoryStructureTree({
  categories,
  onDeleteCategory,
  onToggleCategoryStatus,
  onDeleteSubcategory,
  onToggleSubcategoryStatus,
}: CategoryStructureTreeProps) {
  const [openCategoryIds, setOpenCategoryIds] = useState<Record<string, boolean>>({});

  function toggleCategory(categoryId: string) {
    setOpenCategoryIds((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  }

  if (!categories.length) {
    return <p className="text-sm text-white/60">No categories created yet.</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {categories.map((category) => {
        const isOpen = openCategoryIds[category.id] ?? false;

        return (
          <div
            className="rounded-2xl border border-white/10 bg-black/10"
            key={category.id}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <button
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => toggleCategory(category.id)}
                type="button"
              >
                <span
                  className={`text-sm text-white/55 transition-transform ${
                    isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                >
                  v
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium leading-5">{category.name}</p>
                  <p className="truncate text-xs text-white/55">
                    {`Order ${category.sortOrder}${category.isActive ? "" : " | Archived"} | ${category.subcategoryCount} subcategories`}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-white/60">
                  {category.productCount} products
                </span>
                <CategoryOptionsMenu
                  categoryName={category.name}
                  isActive={category.isActive}
                  onDelete={() => onDeleteCategory(category.id)}
                  onToggleStatus={() =>
                    onToggleCategoryStatus(category.id, !category.isActive)
                  }
                />
              </div>
            </div>

            {isOpen ? (
              <div className="space-y-2 border-t border-white/10 px-4 py-3">
                {category.subcategories.length ? (
                  category.subcategories.map((subcategory) => (
                    <div
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                      key={subcategory.id}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium leading-5">
                            {subcategory.name}
                          </p>
                          <p className="truncate text-xs text-white/55">
                            {`Order ${subcategory.sortOrder}${
                              subcategory.isActive ? "" : " | Archived"
                            }${
                              subcategory.isHiddenByParent
                                ? " | Hidden by archived category"
                                : ""
                            } | ${subcategory.productCount} products`}
                          </p>
                        </div>
                        <SubcategoryOptionsMenu
                          isActive={subcategory.isActive}
                          onDelete={() => onDeleteSubcategory(subcategory.id)}
                          onToggleStatus={() =>
                            onToggleSubcategoryStatus(
                              subcategory.id,
                              !subcategory.isActive,
                            )
                          }
                          subcategoryName={subcategory.name}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/60">
                    No subcategories under this category yet.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
