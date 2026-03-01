import Link from "next/link";
import { Surface } from "@beads-bonita/ui/surface";

function getError(searchParams: Record<string, string | string[] | undefined>) {
  if (searchParams.error === "register") {
    return "Registration failed. Please try again with a different email.";
  }

  return null;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage = getError(params);

  return (
    <main className="page-shell min-h-screen px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Surface className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
            Join the community
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-charcoal)]">
            Create your customer account.
          </h1>
          <p className="mt-5 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            Your account will be used for order history, wishlist access,
            address management, and customer testimonial submissions.
          </p>
        </Surface>

        <Surface className="p-8">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
            Register
          </h2>
          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-[var(--color-bonita-sand)] bg-white/70 px-4 py-3 text-sm text-[var(--color-bonita-cocoa)]">
              {errorMessage}
            </div>
          ) : null}
          <form action="/auth/register" className="mt-6 space-y-4" method="post">
            <label className="block space-y-2 text-sm">
              <span>Full name</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-bonita-sand)] bg-white/80 px-4 py-3 outline-none"
                name="fullName"
                required
                type="text"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Email</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-bonita-sand)] bg-white/80 px-4 py-3 outline-none"
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Password</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-bonita-sand)] bg-white/80 px-4 py-3 outline-none"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>
            <button
              className="w-full rounded-full bg-[var(--color-bonita-charcoal)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-ivory)]"
              type="submit"
            >
              Create account
            </button>
          </form>
          <p className="mt-6 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--color-bonita-cocoa)]" href="/login">
              Sign in
            </Link>
          </p>
        </Surface>
      </div>
    </main>
  );
}
