"use client";

import InteractiveSelector from "@/components/ui/interactive-selector";

type CategoryShowcaseItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export function ShopByCategoryShowcase({
  categories,
}: {
  categories: CategoryShowcaseItem[];
}) {
  if (!categories.length) {
    return null;
  }

  return (
    <section className="bg-[#f7f5f2] px-6 pb-24 pt-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-bonita-moss)]">
            Shop by Category
          </p>
        </div>

        <InteractiveSelector
          options={categories.map((category) => ({
            id: category.id,
            title: category.name,
            description: `Explore ${category.name.toLowerCase()} through curated pieces and custom-made details.`,
            href: `/category/${category.slug}`,
            imageUrl: category.imageUrl,
          }))}
        />
      </div>
    </section>
  );
}
