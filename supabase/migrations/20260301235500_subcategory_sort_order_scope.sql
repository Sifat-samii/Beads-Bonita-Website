drop index if exists public.subcategories_category_sort_order_unique_idx;
create unique index subcategories_category_sort_order_unique_idx
  on public.subcategories (category_id, sort_order)
  where deleted_at is null;
