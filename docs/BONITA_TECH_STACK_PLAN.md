# BEADS BONITA Master Product and Technical Execution Plan
## Summary
`BEADS BONITA` will be a Bangladesh-first, artistic, mobile-first e-commerce platform for handcrafted jewelry, designed to convert Instagram-led discovery into a premium branded buying experience. The website must combine strong emotional storytelling, modern commerce UX, clean operations, and a lean high-standard technical architecture.

This version of the master plan is aligned strictly to your approved stack:
- `Next.js + TypeScript`
- `Tailwind CSS + shadcn/ui`
- `Framer Motion`
- `Supabase-first backend`
- `SSLCOMMERZ` payment integration
- monorepo with separate `storefront` and `admin` apps
- RLS-first security model
- minimal moving parts and minimal vendor count

This document is intended to be the single source of truth for product scope, UX direction, system architecture, data structure, access control, and phase-wise implementation.

## 1. Vision and Brand Philosophy
### Core Vision
Build a world-class handcrafted jewelry e-commerce platform that:
- elevates handmade craftsmanship
- promotes sustainability and authentic creation
- creates emotional connection with buyers
- increases trust and conversion beyond Instagram and Facebook
- transforms the brand into a premium digital destination

### Brand Positioning
The brand should feel:
- calm
- natural
- earthy
- artistic
- handmade
- editorial
- expressive but minimal
- sustainable luxury
- emotionally warm and human

### Emotional Goal
Customers should feel:
- they are supporting real art
- they are buying something meaningful
- they are connected to a conscious creative community
- the product is made with care, not mass-produced
- the brand is trustworthy, refined, and memorable

## 2. Business Objectives
### Primary Objectives
- create long-term brand value
- reduce dependency on Instagram DMs for orders
- improve customer trust through a professional commerce platform
- increase conversion rate from social media traffic
- improve average order value through bundles, merchandising, and upsells
- maintain a customer database for retention and future campaigns
- enable efficient back-office operations through a custom admin dashboard

### Success Metrics
- conversion rate
- add-to-cart rate
- checkout completion rate
- average order value
- repeat customer rate
- best-selling categories
- low-stock incidents
- testimonial submission and approval volume
- Instagram-to-website conversion
- revenue by day, week, month

## 3. User Roles
### Admin
The admin requires:
- a modern operations dashboard
- KPI and trend visibility
- product CRUD
- inventory control
- order tracking and status updates
- customer management
- testimonial moderation
- homepage and merchandising control

### Visitors / Customers
Customers require:
- exceptional homepage experience
- easy navigation and discovery
- smart browsing and filtering
- trustworthy product detail pages
- smooth cart and checkout
- account management
- ability to submit testimonials with image upload after login

## 4. Market and Commerce Assumptions
### Launch Assumptions
- launch country: Bangladesh
- currency: `BDT`
- language: English-first, Bangla-ready later
- shipping: domestic only at launch
- payments: `SSLCOMMERZ` with Bangladesh-compatible methods
- commerce model: mixed ready-stock and made-to-order/custom products

### Product Sales Models
Each product can be one of:
- `ready_stock`
- `made_to_order`
- `custom_request_enabled`

This distinction must appear both in admin configuration and customer-facing product messaging.

## 5. Product Catalog Structure
### Main Categories
- Necklace
- Bracelets
- Phone Charms
- Earrings
- Ring
- Waist Chain
- Arm Cuff
- Anklet

### Example Dynamic Subcategories
Necklace:
- Beaded
- Pearl
- Layered
- Minimal
- Statement
- Ethnic
- Custom

Bracelets:
- Thread
- Stone
- Charm
- Adjustable
- Couple
- Minimal

Phone Charms:
- Pearl
- Color Theme Based
- Alphabet
- Customizable

Earrings:
- Stud
- Drop
- Hoop
- Handmade Clay
- Pearl
- Lightweight

### Catalog Rules
- admin can create unlimited categories and subcategories
- products can be tagged for cross-merchandising
- products can be marked as featured, bestseller, new, or limited edition
- products can contain multiple images
- products may optionally have variants
- category hierarchy must remain manageable and admin-friendly

## 6. UX and Experience Strategy
### Design Philosophy
The experience must be:
- elegant but easy
- artistic but usable
- premium but not intimidating
- editorial but conversion-focused
- mobile-first due to social-led traffic

### Visual Direction
- earth tones
- soft beige
- muted brown
- sage green
- off-white
- warm clay shades
- textured or layered backgrounds
- deep charcoal and warm neutrals for dark mode
- no harsh black-white contrast
- no generic template look

### Typography
- refined serif for headings
- clean sans-serif for body/UI
- handwritten accent font used sparingly for emotional emphasis

### Motion and Interaction
- subtle animated reveals
- soft hover transitions
- elegant carousel behavior
- smooth product gallery interactions
- micro-interactions via `Framer Motion`
- animation must never harm usability or performance

### UX Principles
- clear CTA hierarchy
- mobile-first navigation
- simple checkout
- trust-building at every key decision point
- clean empty states
- persistent visual clarity in both light and dark mode
- accessibility baseline from day one

## 7. Information Architecture
### Public Pages
- Home
- Shop All
- Category Pages
- Subcategory Pages
- Product Detail Page
- About Us
- Sustainability
- Testimonials
- Custom Order Request
- Cart
- Checkout
- Order Confirmation
- Login
- Register
- Forgot Password
- Profile
- Saved Addresses
- Order History
- Order Detail / Tracking
- Wishlist
- Contact
- FAQ
- Privacy Policy
- Terms and Conditions
- Shipping Policy
- Return / Refund / Exchange Policy

### Admin Pages
- Dashboard
- Products
- Add Product
- Edit Product
- Categories / Subcategories
- Orders
- Order Detail
- Inventory
- Customers
- Testimonials Moderation
- Homepage Content Manager
- Media Manager
- Coupons
- Settings
- Reports

## 8. Homepage Structure
### Homepage Role
The homepage must function as:
- first impression
- brand story
- product gateway
- trust builder
- conversion engine

### Section Flow
1. Hero section
- immersive visual
- short brand statement
- primary CTA: `Explore Collection`
- secondary CTA: `Our Story`

2. Featured collections
- 3 to 4 curated editorial collection blocks

3. Shop by category
- visual category grid

4. Brand values
- handmade
- sustainable
- authentic
- small-batch
- emotionally crafted

5. Best sellers

6. New arrivals / latest drop

7. Customer testimonials
- approved only
- user image support

8. Instagram gallery integration

9. Custom order spotlight

10. Newsletter / community sign-up

11. Footer

### Homepage Management Requirements
Admin must be able to control:
- hero visuals
- section headlines
- featured categories
- section ordering
- promotional banners
- featured testimonials
- featured collections
- seasonal campaign blocks

## 9. Customer Functional Requirements
### Browsing and Search
- shop all view
- category and subcategory filtering
- sort by newest, price, popularity, featured
- filters by material, color, availability, category, subcategory
- search with responsive suggestions
- mobile filter drawer
- elegant product cards

### Product Detail Page
- high-resolution gallery
- zoom/lightbox
- mobile swipe
- price and sale price
- variant selector if applicable
- stock or lead-time messaging
- add to cart
- buy now
- wishlist
- story/craftsmanship note
- sustainability note
- care instructions
- delivery estimate
- social sharing
- related products
- recently viewed

### Cart
- add/remove items
- quantity update
- subtotal calculation
- coupon entry
- shipping estimate or shipping rule display
- cart drawer and full cart page

### Checkout
- secure checkout flow
- address form optimized for Bangladesh
- phone number required
- shipping selection
- payment via `SSLCOMMERZ`
- order note field
- clear summary and totals
- account creation/sign-in during flow if needed

### Profile
- profile edit
- address management
- order history
- order tracking
- wishlist
- testimonial submission
- password management

### Testimonial System
- authenticated users only
- optional image upload
- testimonial status defaults to pending
- admin approval required
- approved testimonials visible on homepage and dedicated page

## 10. Admin Functional Requirements
### Dashboard
Phase 1 KPI scope:
- total orders
- revenue
- best sellers
- low stock
- new customers

Additional operational indicators:
- pending testimonials
- pending payments
- recent orders
- order status breakdown

### Product Management
Admin must be able to:
- create products
- update products
- duplicate products
- archive products
- soft delete products
- manage categories and subcategories
- upload images
- configure variants if needed
- control publishing
- assign featured flags
- edit SEO data

### Product Fields
- name
- slug
- short description
- long description
- craftsmanship story
- sustainability information
- care instructions
- category
- subcategory
- tags
- SKU
- price
- compare-at price optional
- product type
- lead time
- stock quantity
- low stock threshold
- images
- variant data
- publish status
- featured flags
- SEO title
- SEO description

### Order Management
Admin must be able to:
- list and search all orders
- filter by status and date
- inspect customer and item details
- update order status
- record notes
- track payment state
- view order event timeline
- attach courier/tracking reference
- manage failed or cancelled payment cases

### Inventory Management
- inventory overview
- low stock list
- stock quantity management
- manual stock adjustment
- adjustment reason required
- inventory history log

### Client Management
- profile overview
- order history
- total spent
- notes
- tags
- address view
- marketing consent flag
- testimonial history

### Testimonial Moderation
- approve
- reject
- hide
- feature on homepage
- map to product if applicable

## 11. Technical Stack and Repository Plan
### Stack Rules
This project must follow these non-negotiable rules:
- Supabase-first
- simple architecture
- minimal moving parts
- minimal vendors
- RLS everywhere
- sensitive actions only on server or edge functions
- no extra backend server unless clearly necessary
- no Redis, Meilisearch, queues, or extra services until real pain exists

### Monorepo Structure
```text
/apps/storefront
/apps/admin
/packages/ui
/packages/core
/packages/supabase
/supabase
/docs
```

### Responsibilities
`/apps/storefront`
- customer-facing website
- product browsing
- cart and checkout UI
- profile and testimonials

`/apps/admin`
- admin dashboard
- product CRUD
- orders
- inventory
- clients
- moderation
- homepage control

`/packages/ui`
- shared UI primitives and patterns
- design system components
- shared theme tokens

`/packages/core`
- shared types
- Zod schemas
- constants
- helper utilities
- domain validation logic

`/packages/supabase`
- typed clients
- generated DB types
- shared query helpers
- auth helpers

`/supabase`
- migrations
- seed files
- edge functions
- local Supabase config

`/docs`
- RLS matrix
- schema notes
- maintenance SOP
- migration checklist

## 12. Frontend Architecture
### Storefront and Admin
Both apps should use:
- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Framer Motion`

### Frontend Principles
- strict typing
- reusable UI patterns
- app-specific layouts with shared design tokens
- mobile-first responsive behavior
- optimized media handling
- strong server/client boundary discipline
- minimal client-side complexity where server rendering is better

### UI System Standards
- shared component library in `/packages/ui`
- product cards, grids, filters, modals, forms, charts, drawers shared where sensible
- maintain consistent spacing, color tokens, and typographic hierarchy
- admin UI can be cleaner and more utilitarian while still visually aligned to brand quality

## 13. Supabase Platform Architecture
### Supabase as Core Backend
Supabase will be the single source of truth for:
- products
- categories
- inventory
- orders
- order items
- payment attempts
- users
- profiles
- addresses
- testimonials
- homepage content support tables
- admin dashboard SQL views

### Supabase Services Used
- PostgreSQL
- Auth
- Storage
- Row Level Security
- Edge Functions where appropriate

### Rules
- no service role key in client code
- service role key server-only
- all critical writes are server-side
- browser can only perform safe and authorized actions
- migrations only, no manual production schema edits

## 14. Auth and Role Management
### Roles
Minimum roles:
- `admin`
- `customer`

### Role Storage
Use a `profiles` table linked to `auth.users` with:
- `id`
- `full_name`
- `email`
- `phone`
- `role`
- `avatar_url`
- `marketing_consent`
- `created_at`
- `updated_at`

### Access Model
- admin app routes require server-side admin session validation
- customer actions require authenticated user where needed
- public users can browse products and approved testimonials without login
- testimonials, wishlist, addresses, and order history require authentication

### Session Security
- secure cookies
- Supabase auth session handling
- strong password rules in Supabase configuration
- future rate limiting if abuse emerges

## 15. Database Architecture
### Core Tables
- profiles
- categories
- subcategories
- products
- product_images
- product_variants
- inventory_stock
- inventory_adjustments
- addresses
- orders
- order_items
- payment_attempts
- order_events
- testimonials
- wishlist
- coupons
- admin_notes
- homepage_sections
- system_events

### Important Supporting Views
Use SQL views for lean dashboards:
- sales_summary_daily
- sales_summary_monthly
- best_selling_products
- low_stock_products
- new_customers_summary
- pending_orders_summary

### Table-Level Intent
`profiles`
- user data and role

`categories` and `subcategories`
- structured catalog hierarchy

`products`
- core product definitions and publishing state

`product_images`
- ordered media metadata

`product_variants`
- optional variant records

`inventory_stock`
- quantity and threshold data

`inventory_adjustments`
- audit log of manual stock changes

`orders`
- primary order record

`order_items`
- line items snapshot

`payment_attempts`
- gateway transaction attempts and verification records

`order_events`
- status history timeline

`addresses`
- reusable customer addresses

`testimonials`
- customer-generated social proof with moderation state

`wishlist`
- customer saved products

`coupons`
- optional promotional rules

`admin_notes`
- customer/order operational notes

`homepage_sections`
- dynamic homepage content control

`system_events`
- critical system failures and operational logs

### Data Integrity Rules
- foreign keys enforced
- audit fields on all important tables
- soft delete where appropriate via `deleted_at`
- unique constraints on slug and SKU where needed
- indexes on publish/filter/order columns

## 16. RLS and Access Control Plan
### Global Rule
Every table must have RLS enabled. Default stance is deny by default.

### Required Documentation
Maintain `/docs/rls-matrix.md` with policy-by-policy ownership.

### Minimum RLS Intentions
`products`
- public select only published, non-deleted products
- admin full access

`categories` and `subcategories`
- public read active categories
- admin full CRUD

`orders`
- customer can read only own orders
- direct insert from client avoided
- server creates orders
- admin can read all and manage status

`order_items`
- customer can read own order items through order ownership
- admin full access

`inventory_stock`
- public optional read for stock indicator only if intentionally exposed
- admin update only

`testimonials`
- public can read approved only
- customer can insert own testimonial
- admin can approve/reject/hide/edit moderation fields

`payment_attempts`
- public no access
- customer optional read of own attempts if needed
- server/admin write and verification only

`addresses`
- customer owns own addresses
- admin read only when operationally needed

`wishlist`
- customer owns own wishlist rows
- no public access

### Sensitive Table Rule
For `orders`, `payment_attempts`, `inventory_stock`, and admin-sensitive tables:
- prefer writes through server routes or edge functions with elevated credentials
- keep RLS strict even if server writes use service role

## 17. Payment Architecture
### Gateway
Payment integration must use `SSLCOMMERZ` and must be server-verified.

### Non-Negotiable Rules
- never trust client success state
- payment verification must be server-side
- order is not finalized purely from browser response
- all payment logs must be persisted

### Minimal Payment Flow
1. customer initiates checkout
2. server creates order with `pending_payment`
3. server creates `payment_attempt`
4. customer is redirected to `SSLCOMMERZ`
5. callback/hook hits server route or Supabase edge function
6. server verifies transaction with gateway
7. on success:
- payment attempt marked `success`
- order updated to paid/confirmed
- stock deducted
- order event logged

8. on failure/cancel:
- payment attempt updated
- order marked cancelled or left pending under defined timeout rule
- order event logged

### Payment Attempt Fields
- order_id
- gateway_name
- gateway_transaction_id
- amount
- currency
- status
- raw_response_sanitized
- verification_status
- created_at
- updated_at

## 18. Inventory Model
### Chosen Strategy
Use `Option A`: deduct stock only when payment is verified.

This is the simplest and most maintainable phase-1 approach.

### Inventory Tables
`inventory_stock`
- product_id or variant_id
- quantity
- low_stock_threshold
- updated_at

`inventory_adjustments`
- inventory_stock_id
- admin_id
- reason
- delta
- created_at

### Rules
- no negative stock
- every manual stock change requires reason
- low-stock list visible in admin dashboard
- made-to-order items can bypass stock limits but must display lead time

## 19. Storage and Media Strategy
### Supabase Storage Buckets
- `product-images`
- `testimonial-images`
- `user-avatars` optional

### Media Rules
- admin-only upload for product media
- customer upload allowed for testimonial images only
- testimonial images restricted to user-owned paths
- store only metadata/path in DB
- standardize image sizes
- compress and optimize on upload pipeline where practical

### Security Rules
- public product images are readable
- testimonial images can remain private until moderation logic exposes them
- deleted and orphaned assets handled later via maintenance job

## 20. Server-Side Responsibilities
### Sensitive Actions Must Happen on Server or Edge Function
- create orders
- create payment attempts
- verify payment
- finalize order status
- deduct inventory
- perform admin CRUD
- moderate testimonials
- upload authorization decisions
- homepage admin content mutations

### Recommended Execution Layers
Use:
- Next.js server routes / server actions for app-driven secure workflows
- Supabase edge functions only where they offer clear value, such as payment callbacks or isolated secure tasks

No separate custom backend server should be introduced.

## 21. Public APIs, Interfaces, and Contracts
### Public-Facing Interfaces
- storefront web app
- admin web app
- payment callback endpoint
- transactional notification hooks
- storage upload flow

### Shared Domain Types
`Profile`
- id
- full_name
- email
- phone
- role
- avatar_url
- marketing_consent

`Category`
- id
- name
- slug
- sort_order
- is_active

`Subcategory`
- id
- category_id
- name
- slug
- sort_order
- is_active

`Product`
- id
- category_id
- subcategory_id
- name
- slug
- short_description
- description
- story
- sustainability_info
- care_instructions
- product_type
- sku
- price
- compare_at_price
- is_published
- is_featured
- is_best_seller
- is_limited_edition
- lead_time_days
- deleted_at
- created_at
- updated_at

`ProductImage`
- id
- product_id
- storage_path
- alt_text
- sort_order

`ProductVariant`
- id
- product_id
- name
- sku
- price_override
- is_active

`InventoryStock`
- id
- product_id nullable
- variant_id nullable
- quantity
- low_stock_threshold

`Order`
- id
- user_id
- status
- payment_status
- fulfillment_status
- subtotal
- discount_total
- shipping_total
- grand_total
- currency
- shipping_address_snapshot
- notes
- created_at

`OrderItem`
- id
- order_id
- product_id
- variant_id nullable
- product_name_snapshot
- unit_price
- quantity
- line_total

`PaymentAttempt`
- id
- order_id
- gateway_name
- gateway_transaction_id
- amount
- currency
- status
- verification_status
- raw_response_sanitized

`Testimonial`
- id
- user_id
- product_id nullable
- body
- image_path nullable
- status
- featured
- created_at

### Input Validation
All mutations must use shared `Zod` schemas from `/packages/core`:
- product create/update
- category create/update
- checkout intent
- address input
- testimonial submit
- coupon apply
- inventory adjustment
- admin order update

## 22. SEO, Analytics, and Marketing
### SEO
- SEO-friendly URLs
- editable metadata
- structured data for products
- breadcrumb schema
- sitemap
- robots file
- social previews
- image alt text rules

### Analytics
Start lean. Use:
- SQL views for admin KPIs
- simple event tracking for storefront behavior
- no heavy analytics pipeline initially

Track:
- product view
- add to cart
- begin checkout
- purchase
- testimonial submit
- wishlist add
- custom request submit

### Marketing Integrations
- newsletter capture
- Instagram integration
- future abandoned cart support
- future campaign landing pages
- social proof everywhere it matters
- coupon support optional in phase 1 if timeline allows

## 23. Security Principles
- RLS enabled on all tables
- deny-by-default policies
- service role key only on server
- no sensitive business logic in client
- secure session handling
- strong password policy
- upload validation
- HTML sanitization where applicable
- auditability on important operations
- environment variable separation
- migration-only schema changes

## 24. Quality and Reliability Plan
### Minimum Test Coverage
Unit tests for:
- order total calculation
- inventory deduction rules
- payment verification handler
- testimonial moderation flow

Smoke tests for:
- browse to cart to checkout intent
- payment callback processing
- admin product create/update
- admin order status update

### Error Handling Standards
- structured errors from server routes and edge functions
- correlation IDs using order ID, user ID, payment reference where possible
- critical failures logged to `system_events`

### Monitoring Preparation
- add structured logging points early
- store mission-critical failures in DB
- keep observability simple until real scale requires more

## 25. Change Management and Maintenance
### Dependency Maintenance
- patch updates weekly
- minor updates monthly
- major updates only through planned review

### Schema Maintenance
- all DB changes via Supabase migrations
- no manual production edits
- destructive schema changes require migration and rollback plan
- maintain migration checklist in `/docs`

### Versioning
- tagged releases
- `CHANGELOG.md`
- conventional commits for maintainability

## 26. Phased Delivery Plan
### Phase 0: Foundation Planning
- finalize sitemap
- finalize design language
- establish monorepo
- define schema and RLS matrix
- define shared component system
- define shared Zod schemas

### Phase 1: Core Platform Setup
- Supabase project setup
- auth integration
- migrations
- storage buckets
- base Next.js apps
- packages structure
- generated DB types
- shared UI and utility foundation

### Phase 2: Catalog and Admin Core
- categories and subcategories
- product CRUD
- media upload
- inventory tables and flows
- basic admin dashboard views
- storefront listing and PDP

### Phase 3: Commerce Core
- cart
- checkout intent
- SSLCOMMERZ integration
- order creation
- payment verification
- order history
- admin order management

### Phase 4: Brand and Community
- artistic homepage sections
- testimonials workflow
- wishlist
- sustainability storytelling
- custom order request flow
- SEO setup
- analytics events

### Phase 5: Optimization
- performance tuning
- accessibility hardening
- better KPI views
- merchandising refinement
- optional coupons and campaign enhancements

## 27. Test Scenarios and Acceptance Criteria
### Storefront
- public users can browse published products only
- category and subcategory pages are responsive and filter correctly
- PDP shows accurate stock or lead time based on product type
- user can add and modify cart items
- checkout creates valid pending order
- payment callback updates order correctly
- approved testimonials display publicly
- dark mode remains legible and premium

### Auth and Account
- user can register, login, logout, reset password
- customer can access only own profile, addresses, orders, wishlist
- unauthenticated users cannot submit testimonials

### Admin
- admin can manage product lifecycle safely
- admin can adjust stock with logged reasons
- admin can view and update orders
- admin can moderate testimonials
- dashboard views show correct KPI totals

### Security
- non-admin users cannot access admin app data
- public users cannot query unpublished products
- direct client-side order/payment/inventory mutation is blocked
- service role never exposed in client bundle
- uploads enforce ownership and type restrictions

### Reliability
- duplicate payment callbacks do not duplicate finalization
- failed payment verification leaves auditable records
- stock cannot go negative
- soft-deleted records remain excluded from public views

## 28. Risks and Mitigations
- Risk: artistic design may reduce usability
- Mitigation: enforce strong information hierarchy and commerce-first flows

- Risk: overbuilding early
- Mitigation: strict Supabase-first lean architecture and phased rollout

- Risk: RLS complexity causing development mistakes
- Mitigation: maintain `rls-matrix.md`, test policies, keep sensitive writes server-side

- Risk: payment integration errors
- Mitigation: server-side verification, payment attempt logging, idempotent handling

- Risk: image-heavy experience harming performance
- Mitigation: storage discipline, compression, responsive rendering, limited heavy motion

## 29. Explicit Assumptions and Defaults
- one brand, one storefront, one primary admin team at launch
- Bangladesh-first launch
- `BDT` as default currency
- `SSLCOMMERZ` as the sole payment gateway
- no separate custom backend server
- Supabase is the backend platform
- monorepo with separate storefront and admin apps
- RLS on every table
- direct client writes to critical commerce tables are avoided
- stock deducted only after verified payment
- optional services like Redis, Meilisearch, or advanced analytics are not included initially
- SQL views are used first for KPIs before materialized views or aggregation tables
- testimonials require login and moderation
- wishlist requires login
- custom orders are supported through a dedicated request flow rather than overcomplicated product logic in phase 1

## 30. Final Outcome Definition
When implemented correctly, `BEADS BONITA` will be:
- a premium artistic jewelry storefront
- a modern customer-trust engine
- a maintainable Supabase-first commerce platform
- a secure, RLS-driven system
- a streamlined business operations dashboard
- a scalable foundation for future growth without unnecessary technical complexity
