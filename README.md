# BEADS BONITA

Bangladesh-first handcrafted jewelry e-commerce platform built with a lean Supabase-first architecture.

## Stack

- `Next.js` + `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Supabase`
- `SSLCOMMERZ`
- `pnpm` monorepo + `Turborepo`

## Workspace

```text
apps/
  admin
  storefront
packages/
  core
  supabase
  ui
  eslint-config
  tailwind-config
  typescript-config
supabase/
docs/
```

## Commands

```bash
pnpm install
pnpm dev
pnpm dev:storefront
pnpm dev:admin
pnpm lint
pnpm check-types
```

## Notes

- `docs/rls-matrix.md` tracks Row Level Security intent.
- `docs/schema-notes.md` tracks schema decisions.
- `supabase/migrations` contains schema changes only through migrations.
