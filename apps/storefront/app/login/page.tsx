import Link from "next/link";
import { authMessages, brand } from "@beads-bonita/core";
import { Surface } from "@beads-bonita/ui/surface";

function getMessage(searchParams: Record<string, string | string[] | undefined>) {
  const error = searchParams.error;
  const message = searchParams.message;

  if (error === "credentials") {
    return authMessages.invalidCredentials;
  }

  if (message === "registered") {
    return authMessages.accountCreated;
  }

  if (message === "signedout") {
    return authMessages.signedOut;
  }

  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusMessage = getMessage(params);

  return (
    <main className="page-shell min-h-screen px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-moss)]">
            Welcome back
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-charcoal)]">
            Sign in to continue your BEADS BONITA journey.
          </h1>
          <p className="mt-5 text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            Access saved addresses, wishlist items, order history, and future
            testimonial submissions from your account.
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-[var(--color-bonita-ivory)] p-5">
            <p className="text-sm font-medium text-[var(--color-bonita-cocoa)]">
              {brand.tagline}
            </p>
          </div>
        </Surface>

        <Surface className="p-8">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
            Customer Login
          </h2>
          <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            Use the account created with your email and password.
          </p>
          {statusMessage ? (
            <div className="mt-6 rounded-2xl border border-[var(--color-bonita-sand)] bg-white/70 px-4 py-3 text-sm text-[var(--color-bonita-cocoa)]">
              {statusMessage}
            </div>
          ) : null}
          <form action="/auth/login" className="mt-6 space-y-4" method="post">
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
                name="password"
                required
                type="password"
              />
            </label>
            <button
              className="w-full rounded-full bg-[var(--color-bonita-charcoal)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-ivory)]"
              type="submit"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-sm text-[color-mix(in_srgb,var(--color-bonita-charcoal)_74%,white)]">
            New here?{" "}
            <Link className="font-semibold text-[var(--color-bonita-cocoa)]" href="/register">
              Create an account
            </Link>
          </p>
        </Surface>
      </div>
    </main>
  );
}
