alter table public.subcategories
  drop constraint if exists subcategories_slug_key;

drop index if exists public.subcategories_category_slug_unique_idx;
create unique index subcategories_category_slug_unique_idx
  on public.subcategories (category_id, slug)
  where deleted_at is null;

drop index if exists public.subcategories_category_name_unique_idx;
create unique index subcategories_category_name_unique_idx
  on public.subcategories (category_id, lower(name))
  where deleted_at is null;
