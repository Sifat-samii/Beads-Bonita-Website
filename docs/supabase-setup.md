# Supabase Setup

This setup is required now before the new auth flow can be used against a real backend.

## 1. Create the Supabase Project

- create a new Supabase project
- keep the project region close to your users if possible
- copy the project URL, anon key, and service role key

## 2. Create Local Environment Variables

Create a root `.env.local` file and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_SANDBOX=true
```

The app scripts are configured to load this root `.env.local`, so you do not need separate env files inside `apps/storefront` or `apps/admin`.

## 3. Auth Dashboard Settings

In Supabase Auth settings:

- set Site URL to `http://localhost:3000`
- add Redirect URLs:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3001/auth/callback`
- for easier local testing, you may temporarily disable email confirmation in the Email provider settings

## 3.1 Google Provider Setup

If you want Google or Gmail signup/login, enable the Google provider in Supabase Auth.

In Supabase:

- go to `Authentication -> Providers -> Google`
- enable the provider
- create Google OAuth credentials in Google Cloud
- set the Google OAuth redirect URI to the Supabase callback URL shown in the provider screen

You will need:

- Google client ID
- Google client secret

After saving them in Supabase, the new `Continue with Google` buttons in both apps will work.

## 4. Apply the Database Migrations

You have two reasonable paths.

### Option A: Push directly to your hosted project

Recommended if you want to move fast right now.

Commands:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### Option B: Run Supabase locally first

Use this if you want a local Postgres/Auth/Storage stack.

Commands:

```bash
npx supabase start
npx supabase db reset
```

## 5. Promote Your Admin User

After you register your first account in the storefront, open Supabase and run:

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_ID';
```

Without this, the admin login page will reject access.

## 6. Important Note About CLI on This Repo

The local `supabase` package binary was blocked by pnpm build-script approval on this machine.

If you want to use the repo-installed CLI instead of `npx`, run:

```bash
pnpm approve-builds
```

Approve:

- `supabase`
- `sharp`

After that, commands like `pnpm exec supabase db push` should work.

## 7. What to Test After Setup

1. start the storefront with `pnpm dev:storefront`
2. test email signup at `/register`
3. test Google signup/login at `/login`
4. confirm `/account` is accessible
5. promote your user to admin in Supabase
6. start the admin app with `pnpm dev:admin`
7. test admin email login or Google login at `http://localhost:3001/login`
