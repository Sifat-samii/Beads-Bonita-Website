drop policy if exists "subcategories public read" on public.subcategories;
drop policy if exists "products public read" on public.products;
drop policy if exists "product images public read" on public.product_images;
drop policy if exists "variants public read" on public.product_variants;

create policy "subcategories public read" on public.subcategories
  for select using (
    is_active = true
    and deleted_at is null
    and exists (
      select 1
      from public.categories
      where categories.id = subcategories.category_id
        and categories.is_active = true
        and categories.deleted_at is null
    )
  );

create policy "products public read" on public.products
  for select using (
    status = 'published'
    and deleted_at is null
    and exists (
      select 1
      from public.categories
      where categories.id = products.category_id
        and categories.is_active = true
        and categories.deleted_at is null
    )
    and (
      subcategory_id is null
      or exists (
        select 1
        from public.subcategories
        where subcategories.id = products.subcategory_id
          and subcategories.category_id = products.category_id
          and subcategories.is_active = true
          and subcategories.deleted_at is null
      )
    )
  );

create policy "product images public read" on public.product_images
  for select using (
    exists (
      select 1
      from public.products
      where products.id = product_images.product_id
        and products.status = 'published'
        and products.deleted_at is null
        and exists (
          select 1
          from public.categories
          where categories.id = products.category_id
            and categories.is_active = true
            and categories.deleted_at is null
        )
        and (
          products.subcategory_id is null
          or exists (
            select 1
            from public.subcategories
            where subcategories.id = products.subcategory_id
              and subcategories.category_id = products.category_id
              and subcategories.is_active = true
              and subcategories.deleted_at is null
          )
        )
    )
  );

create policy "variants public read" on public.product_variants
  for select using (
    exists (
      select 1
      from public.products
      where products.id = product_variants.product_id
        and products.status = 'published'
        and products.deleted_at is null
        and exists (
          select 1
          from public.categories
          where categories.id = products.category_id
            and categories.is_active = true
            and categories.deleted_at is null
        )
        and (
          products.subcategory_id is null
          or exists (
            select 1
            from public.subcategories
            where subcategories.id = products.subcategory_id
              and subcategories.category_id = products.category_id
              and subcategories.is_active = true
              and subcategories.deleted_at is null
          )
        )
    )
  );
