# Route Inventory

This document lists the routes that currently exist in the codebase.

It is a working implementation reference, not a future sitemap.

## Storefront

### Public pages

- `/`
  - Home page
- `/shop`
  - Shop listing page
- `/category/[slug]`
  - Category listing page
- `/subcategory/[slug]`
  - Subcategory listing page
- `/product/[slug]`
  - Product detail page
- `/cart`
  - Cart page
- `/checkout`
  - Checkout page
- `/checkout/result`
  - Payment result page
- `/sustainability`
  - Sustainability page
- `/testimonials`
  - Testimonials page
- `/custom-orders`
  - Custom orders page

### Customer auth and account pages

- `/login`
  - Storefront customer login page
- `/register`
  - Storefront customer registration page
- `/account`
  - Customer account page

### Storefront auth routes

- `/auth/login`
  - Customer email/password login handler
- `/auth/register`
  - Customer registration handler
- `/auth/google`
  - Customer Google OAuth start route
- `/auth/callback`
  - Customer OAuth callback route
- `/auth/logout`
  - Customer logout route

### Storefront API routes

- `/api/checkout/intent`
  - Checkout intent validation route
- `/api/checkout/finalize`
  - Checkout finalization and order creation route
- `/api/payments/sslcommerz/callback/[status]`
  - SSLCOMMERZ callback route
- `/api/payments/sslcommerz/ipn`
  - SSLCOMMERZ IPN route

## Admin

### Admin pages

- `/`
  - Admin dashboard
- `/login`
  - Admin login page
- `/products`
  - Product, category, and subcategory management page
- `/products/[productId]`
  - Product edit page
- `/orders`
  - Orders list page
- `/orders/[orderId]`
  - Order detail page
- `/inventory`
  - Inventory management page

### Admin auth routes

- `/auth/login`
  - Admin email/password login handler
- `/auth/google`
  - Admin Google OAuth start route
- `/auth/callback`
  - Admin OAuth callback route
- `/auth/logout`
  - Admin logout route

### Admin utility routes

- `/products/validate`
  - Product identity validation route for name, slug, and SKU checks
- `/products/flash-error`
  - Flash error reset route for product forms

## Notes

- This file tracks routes that are implemented now.
- Planned pages from `BONITA_PLAN.md` and `BONITA_TECH_STACK_PLAN.md` are not listed here unless they already exist in the app.
- Dynamic routes are shown using their file-system form, for example `/product/[slug]`.
