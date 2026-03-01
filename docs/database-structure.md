# Database Structure

This file is a quick working reference for the current BEADS BONITA database design and the related catalog rules already implemented in the app.

It is intended to stay shorter and more execution-focused than the full master plan.

## Table List

Core identity and access:
- `profiles`

Catalog:
- `categories`
- `subcategories`
- `products`
- `product_images`
- `product_variants`

Inventory:
- `inventory_stock`
- `inventory_adjustments`

Customer:
- `addresses`
- `wishlist`
- `testimonials`

Orders and payments:
- `orders`
- `order_items`
- `payment_attempts`
- `order_events`

Content and operations:
- `homepage_sections`
- `system_events`

## Relationships

User and profile:
- `auth.users.id -> profiles.id`
- deleting an auth user deletes the related profile

Catalog hierarchy:
- `categories.id -> subcategories.category_id`
- deleting a category cascades to subcategories at the database level
- `categories.id -> products.category_id`
- `subcategories.id -> products.subcategory_id`

Product media and variants:
- `products.id -> product_images.product_id`
- `products.id -> product_variants.product_id`
- deleting a product cascades to product images and variants

Inventory:
- `products.id -> inventory_stock.product_id`
- `product_variants.id -> inventory_stock.variant_id`
- `inventory_stock.id -> inventory_adjustments.inventory_stock_id`
- each inventory row must point to either a product or a variant, never both

Customer data:
- `profiles.id -> addresses.user_id`
- `profiles.id -> testimonials.user_id`
- `products.id -> testimonials.product_id`
- `profiles.id -> wishlist.user_id`
- `products.id -> wishlist.product_id`

Orders:
- `profiles.id -> orders.user_id`
- `orders.id -> order_items.order_id`
- `products.id -> order_items.product_id`
- `product_variants.id -> order_items.variant_id`
- `orders.id -> payment_attempts.order_id`
- `orders.id -> order_events.order_id`
- `profiles.id -> order_events.actor_id`

## Slug Rules

Current enforced rules:
- category slugs must be lowercase
- subcategory slugs must be lowercase
- product slugs must be lowercase
- slug format must match: lowercase letters, numbers, and hyphens only
- spaces are not allowed in slugs
- duplicate category slug is not allowed
- duplicate product slug is not allowed
- duplicate subcategory slug is not allowed inside the same category
- the same subcategory slug is allowed under different categories
- subcategory slug cannot match an existing category slug in admin logic

Slug validation pattern:

```txt
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

## SKU Format

Current enforced rules:
- product SKU is required in admin product creation and editing
- active product SKU cannot be duplicated
- SKU uniqueness is enforced at both app logic and database index level

Current format status:
- uniqueness is enforced
- a strict visual naming pattern is not yet enforced in schema or database

Recommended working convention for the project:

```txt
BB-<CATEGORY>-<NUMBER>
```

Example:

```txt
BB-ER-007
```

Recommended convention rules:
- uppercase segments
- hyphen-separated
- brand prefix first
- short category code second
- numeric sequence last

This convention is currently a team rule, not a hard database constraint.

## Lead Time Logic

Product types:
- `ready_stock`
- `made_to_order`
- `custom_request_enabled`

Lead time rules:
- `lead_time_days` is optional
- `lead_time_days` must be `>= 0` when provided
- ready-stock products may leave lead time empty
- made-to-order products should use lead time to communicate dispatch expectation
- custom-request-enabled products may use lead time if there is a typical turnaround window

Operational interpretation for storefront:
- ready-stock: show stock-based availability
- made-to-order: show lead time clearly on PDP and later checkout
- custom-request-enabled: show custom-order behavior and lead time only if defined

## Inventory Rules

Current inventory model:
- one stock row can belong to a product or a variant
- quantity cannot go below `0`
- low-stock threshold cannot go below `0`
- stock adjustments are logged in `inventory_adjustments`
- each manual adjustment requires an admin and a reason

Project rule already agreed:
- deduct stock only after verified payment

Admin behavior already implemented:
- low-stock threshold is required in product forms
- stock quantity is required in product forms
- manual stock adjustment is available in admin inventory management
- adjustment history is recorded

Catalog lifecycle rules already implemented:
- archiving a category archives all subcategories and products under it
- publishing a category publishes all subcategories and products under it
- archiving a subcategory archives all products under it
- publishing a subcategory publishes all products under it, but only if the parent category is active
- deleting a category removes its subcategories and products
- deleting a subcategory removes its products

## Current Notes

- RLS is enabled across the core tables. See [rls-matrix.md](/e:/Cursor%20projects/Bonita%20Website/docs/rls-matrix.md).
- Schema changes must go through Supabase migrations only.
- For broader design intent and project goals, keep this file aligned with:
  - [BONITA_PLAN.md](/e:/Cursor%20projects/Bonita%20Website/docs/BONITA_PLAN.md)
  - [BONITA_TECH_STACK_PLAN.md](/e:/Cursor%20projects/Bonita%20Website/docs/BONITA_TECH_STACK_PLAN.md)
  - [schema-notes.md](/e:/Cursor%20projects/Bonita%20Website/docs/schema-notes.md)
