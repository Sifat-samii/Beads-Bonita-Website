import { type HomeNavItem } from "../_components/home-mega-nav";
import { getCatalogContext, getPublishedProducts } from "./catalog";

function formatCategoryLabel(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export async function getHomeChromeData() {
  const [{ categories, subcategoriesByCategory }, featuredProducts] = await Promise.all([
    getCatalogContext(),
    getPublishedProducts({ sort: "featured", limit: 8 }),
  ]);

  const navItems: HomeNavItem[] = await Promise.all(
    categories.map(async (category) => {
      const subcategories = subcategoriesByCategory.get(category.id) ?? [];
      const categoryProducts = await getPublishedProducts({
        categoryId: category.id,
        sort: "featured",
        limit: 8,
      });

      const highlightProduct =
        categoryProducts.find((product) => product.isBestSeller) ??
        categoryProducts.find((product) => product.isLimitedEdition) ??
        categoryProducts[0] ??
        null;

      const subcategoryEntries = await Promise.all(
        (subcategories.length
          ? subcategories
          : [
              {
                id: `${category.id}-all`,
                slug: category.slug,
                name: `All ${category.name}`,
              },
            ]
        ).map(async (subcategory) => {
          const products = subcategories.length
            ? await getPublishedProducts({
                subcategoryId: subcategory.id,
                sort: "featured",
                limit: 4,
              })
            : categoryProducts.slice(0, 4);

          return {
            label: subcategory.name,
            href: subcategories.length
              ? `/subcategory/${subcategory.slug}`
              : `/category/${category.slug}`,
            products: products.map((product) => ({
              id: product.id,
              name: product.name,
              href: `/product/${product.slug}`,
              imageUrl: product.primaryImageUrl,
              price: formatPrice(product.price),
            })),
          };
        }),
      );

      return {
        label: formatCategoryLabel(category.name),
        href: `/category/${category.slug}`,
        description: `Explore ${category.name.toLowerCase()} through handcrafted pieces, live inventory, and an editorial browsing flow.`,
        subcategories: subcategoryEntries.filter((entry) => entry.products.length > 0),
        highlight: {
          title: highlightProduct?.name ?? `${category.name} spotlight`,
          body:
            highlightProduct?.shortDescription ??
            `A curated Bonita entry point into ${category.name.toLowerCase()}, built to feel collected, layered, and giftable.`,
          href: highlightProduct
            ? `/product/${highlightProduct.slug}`
            : `/category/${category.slug}`,
          imageUrl: highlightProduct?.primaryImageUrl ?? null,
          badge: highlightProduct?.isBestSeller
            ? "Best seller"
            : highlightProduct?.isLimitedEdition
              ? "Limited edition"
              : "Category highlight",
        },
      };
    }),
  );

  const announcementSlides =
    featuredProducts.length > 0
      ? featuredProducts.slice(0, 4).map((product) => ({
          id: product.id,
          href: `/product/${product.slug}`,
          label: product.isLimitedEdition
            ? `Limited edition: ${product.name}. Discover it now.`
            : product.isBestSeller
              ? `Best seller spotlight: ${product.name}. Shop the favorite piece.`
              : `Featured now: ${product.name}. Explore the product page.`,
        }))
      : [
          {
            id: "bonita-shop-banner",
            href: "/shop",
            label: "Featured now: discover the Bonita collection and shop the latest pieces.",
          },
        ];

  return {
    categories,
    featuredProducts,
    navItems,
    announcementSlides,
    subcategoriesByCategory,
  };
}
