import Link from "next/link";
import { authMessages } from "@beads-bonita/core";
import { CustomerAuthShell } from "../_components/customer-auth-shell";

function getMessage(searchParams: Record<string, string | string[] | undefined>) {
  const error = searchParams.error;
  const message = searchParams.message;

  if (error === "credentials") {
    return authMessages.invalidCredentials;
  }

  if (error === "oauth") {
    return authMessages.oauthFailed;
  }

  if (message === "registered") {
    return authMessages.accountCreated;
  }

  if (message === "signedout") {
    return authMessages.signedOut;
  }

  return null;
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="block border-b border-black/12 pb-4 pt-6 first:pt-0">
      <span className="block text-[0.98rem] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_58%,white)]">
        {label}
      </span>
      <input
        className="mt-4 w-full border-none bg-transparent px-0 py-0 text-lg text-[var(--color-bonita-charcoal)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-bonita-charcoal)_32%,white)]"
        name={name}
        required
        type={type}
      />
    </label>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusMessage = getMessage(params);

  return (
    <CustomerAuthShell
      formDescription="Use your account to move through checkout faster, view your profile, and continue into the growing member experience."
      formTitle="Customer Sign In"
      mode="login"
      primaryForm={
        <div className="space-y-8">
          <form action="/auth/google" method="post">
            <button
              className="inline-flex min-h-14 w-full items-center justify-center rounded-none border border-black/12 bg-transparent px-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-charcoal)] transition hover:bg-[rgba(30,23,18,0.04)]"
              type="submit"
            >
              Continue with Google
            </button>
          </form>

          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_42%,white)]">
            <span className="h-px flex-1 bg-black/10" />
            Or sign in with email
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <form action="/auth/login" className="space-y-5" method="post">
            <Field label="Email address*" name="email" type="email" />
            <Field label="Password*" name="password" type="password" />

            <div className="flex justify-end pt-1">
              <p className="text-sm text-[var(--color-bonita-cocoa)] underline decoration-black/15 underline-offset-4">
                Forgot password
              </p>
            </div>

            <button
              className="mt-3 inline-flex min-h-15 w-full items-center justify-center bg-[var(--color-bonita-charcoal)] px-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-ivory)] transition hover:bg-[color-mix(in_srgb,var(--color-bonita-charcoal)_90%,black)]"
              type="submit"
            >
              Sign In
            </button>
          </form>
        </div>
      }
      secondaryAction={
        <div className="space-y-10">
          <h3 className="font-[family-name:var(--font-display)] text-[2.4rem] leading-none text-[var(--color-bonita-charcoal)]">
            Create Account
          </h3>
          <div className="grid gap-x-12 gap-y-4 text-[1.02rem] leading-8 text-[var(--color-bonita-charcoal)] sm:grid-cols-2">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-black" />
                Faster Checkout
              </li>
              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-black" />
                Access your order history
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-black" />
                View saved addresses &amp; payments
              </li>
              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-black" />
                Receive email communications
              </li>
            </ul>
          </div>
          <Link
            className="inline-flex min-h-15 w-full items-center justify-center border border-black/12 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-charcoal)] transition hover:bg-[rgba(30,23,18,0.04)]"
            href="/register"
          >
            Create Account
          </Link>
        </div>
      }
      statusMessage={statusMessage}
      subtitle="Sign in to check out faster, enjoy exclusive perks, and access the full member experience."
      title="Buy Bonita, Be Bonita!"
    />
  );
}
