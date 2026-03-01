alter table public.categories
  add constraint categories_slug_lowercase_check
  check (slug = lower(slug));

alter table public.subcategories
  add constraint subcategories_slug_lowercase_check
  check (slug = lower(slug));

alter table public.products
  add constraint products_slug_lowercase_check
  check (slug = lower(slug));

create unique index if not exists products_name_active_unique_idx
  on public.products (lower(name))
  where deleted_at is null;

create unique index if not exists products_sku_active_unique_idx
  on public.products (sku)
  where deleted_at is null and sku is not null;
