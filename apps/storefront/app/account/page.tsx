import { requireCustomer } from "@beads-bonita/supabase/auth";
import { Surface } from "@beads-bonita/ui/surface";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { profile, user } = await requireCustomer();

  return (
    <main className="page-shell min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Surface className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
            Account overview
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-charcoal)]">
            Hello, {profile.full_name ?? "Bonita customer"}.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            This protected account area is now wired to Supabase authentication.
            The next slices will plug in real order history, addresses, wishlist,
            and testimonial management.
          </p>
        </Surface>

        <div className="grid gap-4 md:grid-cols-3">
          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-moss)]">
              Email
            </p>
            <p className="mt-3 text-lg font-semibold">{user.email}</p>
          </Surface>
          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-moss)]">
              Role
            </p>
            <p className="mt-3 text-lg font-semibold capitalize">{profile.role}</p>
          </Surface>
          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-moss)]">
              Marketing consent
            </p>
            <p className="mt-3 text-lg font-semibold">
              {profile.marketing_consent ? "Opted in" : "Not set"}
            </p>
          </Surface>
        </div>

        <form action="/auth/logout" method="post">
          <button
            className="rounded-full bg-[var(--color-bonita-charcoal)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-ivory)]"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
