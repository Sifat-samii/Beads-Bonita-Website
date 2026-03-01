# RLS Matrix

Every table must have RLS enabled. Default stance: deny by default.

## Public Access

| Table | Select | Insert | Update | Delete |
| --- | --- | --- | --- | --- |
| `categories` | active only | no | no | no |
| `subcategories` | active only | no | no | no |
| `products` | published only | no | no | no |
| `product_images` | only for published products | no | no | no |
| `testimonials` | approved only | no | no | no |
| `homepage_sections` | published only | no | no | no |

## Customer Access

| Table | Select | Insert | Update | Delete |
| --- | --- | --- | --- | --- |
| `profiles` | own record | no | own safe fields | no |
| `addresses` | own only | own only | own only | own only |
| `orders` | own only | no direct client insert | no | no |
| `order_items` | own only through orders | no | no | no |
| `payment_attempts` | own only if exposed | no | no | no |
| `testimonials` | own records | own only | own pending only if enabled | no |
| `wishlist` | own records | own only | no | own only |

## Admin Access

| Table | Select | Insert | Update | Delete |
| --- | --- | --- | --- | --- |
| core commerce tables | full | full | full | controlled |
| `inventory_adjustments` | full | full | no | no |
| `system_events` | full | system only | status only | no |

## Sensitive Writes

- `orders`, `order_items`, `payment_attempts`, and `inventory_stock` should be written via server routes or edge functions.
- `SUPABASE_SERVICE_ROLE_KEY` must never be used in client code.
- payment verification must stay server-side.
