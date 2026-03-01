create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'customer');
create type public.product_status as enum ('draft', 'published', 'archived');
create type public.product_type as enum ('ready_stock', 'made_to_order', 'custom_request_enabled');
create type public.testimonial_status as enum ('pending', 'approved', 'rejected', 'hidden');
create type public.order_status as enum (
  'pending_payment',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded'
);
create type public.payment_status as enum ('pending', 'success', 'failed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  avatar_url text,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  subcategory_id uuid references public.subcategories (id),
  name text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  story text,
  sustainability_info text,
  care_instructions text,
  sku text unique,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price >= 0),
  product_type public.product_type not null default 'ready_stock',
  status public.product_status not null default 'draft',
  lead_time_days integer check (lead_time_days >= 0),
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_limited_edition boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  sku text unique,
  price_override numeric(10,2) check (price_override >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_stock (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 3 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now(),
  constraint inventory_stock_target_check check (
    (product_id is not null and variant_id is null) or
    (product_id is null and variant_id is not null)
  )
);

create table public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  inventory_stock_id uuid not null references public.inventory_stock (id) on delete cascade,
  admin_id uuid not null references public.profiles (id),
  reason text not null,
  delta integer not null,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  phone text not null,
  district text not null,
  area text not null,
  address_line_1 text not null,
  address_line_2 text,
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  status public.order_status not null default 'pending_payment',
  payment_status public.payment_status not null default 'pending',
  fulfillment_status text not null default 'pending',
  subtotal numeric(10,2) not null check (subtotal >= 0),
  discount_total numeric(10,2) not null default 0 check (discount_total >= 0),
  shipping_total numeric(10,2) not null default 0 check (shipping_total >= 0),
  grand_total numeric(10,2) not null check (grand_total >= 0),
  currency text not null default 'BDT',
  shipping_address_snapshot jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  variant_id uuid references public.product_variants (id),
  product_name_snapshot text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  gateway_name text not null default 'sslcommerz',
  gateway_transaction_id text,
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null default 'BDT',
  status public.payment_status not null default 'pending',
  verification_status text not null default 'unverified',
  raw_response_sanitized jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid references public.products (id),
  body text not null,
  image_path text,
  status public.testimonial_status not null default 'pending',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.system_events (
  id uuid primary key default gen_random_uuid(),
  level text not null,
  source text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index products_public_idx on public.products (status, category_id, created_at desc) where deleted_at is null;
create index orders_user_status_idx on public.orders (user_id, status, created_at desc);
create index payment_attempts_order_idx on public.payment_attempts (order_id, status, created_at desc);
create index testimonials_status_idx on public.testimonials (status, created_at desc) where deleted_at is null;
create index inventory_stock_product_idx on public.inventory_stock (product_id, variant_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_stock enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.order_events enable row level security;
alter table public.testimonials enable row level security;
alter table public.wishlist enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.system_events enable row level security;

create policy "profiles self select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles self update" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "categories public read" on public.categories
  for select using (is_active = true and deleted_at is null);

create policy "categories admin manage" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "subcategories public read" on public.subcategories
  for select using (is_active = true and deleted_at is null);

create policy "subcategories admin manage" on public.subcategories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "products public read" on public.products
  for select using (status = 'published' and deleted_at is null);

create policy "products admin manage" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product images public read" on public.product_images
  for select using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and products.status = 'published'
        and products.deleted_at is null
    )
  );

create policy "product images admin manage" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy "variants public read" on public.product_variants
  for select using (
    exists (
      select 1 from public.products
      where products.id = product_variants.product_id
        and products.status = 'published'
        and products.deleted_at is null
    )
  );

create policy "variants admin manage" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

create policy "inventory admin manage" on public.inventory_stock
  for all using (public.is_admin()) with check (public.is_admin());

create policy "inventory adjustments admin read" on public.inventory_adjustments
  for select using (public.is_admin());

create policy "inventory adjustments admin insert" on public.inventory_adjustments
  for insert with check (public.is_admin());

create policy "addresses owner manage" on public.addresses
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "orders own read" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

create policy "orders admin manage" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order items own read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order items admin manage" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy "payments own read" on public.payment_attempts
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = payment_attempts.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "payments admin manage" on public.payment_attempts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order events own read" on public.order_events
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_events.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order events admin manage" on public.order_events
  for all using (public.is_admin()) with check (public.is_admin());

create policy "testimonials public read" on public.testimonials
  for select using (status = 'approved' and deleted_at is null);

create policy "testimonials own read" on public.testimonials
  for select using (user_id = auth.uid());

create policy "testimonials own insert" on public.testimonials
  for insert with check (user_id = auth.uid());

create policy "testimonials admin manage" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

create policy "wishlist own manage" on public.wishlist
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "homepage sections public read" on public.homepage_sections
  for select using (is_published = true);

create policy "homepage sections admin manage" on public.homepage_sections
  for all using (public.is_admin()) with check (public.is_admin());

create policy "system events admin only" on public.system_events
  for all using (public.is_admin()) with check (public.is_admin());
