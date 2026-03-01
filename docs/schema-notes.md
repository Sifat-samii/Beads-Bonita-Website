# Schema Notes

## Principles

- Supabase Postgres is the source of truth.
- Migrations only.
- Soft delete where appropriate.
- Dashboard KPIs start from SQL views.
- Orders and payments must remain auditable.

## Core Tables

- `profiles`
- `categories`
- `subcategories`
- `products`
- `product_images`
- `product_variants`
- `inventory_stock`
- `inventory_adjustments`
- `addresses`
- `orders`
- `order_items`
- `payment_attempts`
- `order_events`
- `testimonials`
- `wishlist`
- `homepage_sections`
- `system_events`
