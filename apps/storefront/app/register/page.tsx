import Link from "next/link";
import { CustomerAuthShell } from "../_components/customer-auth-shell";

function getError(searchParams: Record<string, string | string[] | undefined>) {
  if (searchParams.error === "register") {
    return "Registration failed. Please try again with a different email.";
  }

  return null;
}

function Field({
  label,
  name,
  type,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  minLength?: number;
}) {
  return (
    <label className="block border-b border-black/12 pb-4 pt-6 first:pt-0">
      <span className="block text-[0.98rem] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_58%,white)]">
        {label}
      </span>
      <input
        className="mt-4 w-full border-none bg-transparent px-0 py-0 text-lg text-[var(--color-bonita-charcoal)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-bonita-charcoal)_32%,white)]"
        minLength={minLength}
        name={name}
        required
        type={type}
      />
    </label>
  );
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage = getError(params);

  return (
    <CustomerAuthShell
      formDescription="Set up your customer account once, then return to a cleaner, faster, and more personalized buying experience."
      formTitle="Create Your Account"
      mode="register"
      primaryForm={
        <div className="space-y-8">
          <form action="/auth/google" method="post">
            <button
              className="inline-flex min-h-14 w-full items-center justify-center rounded-none border border-black/12 bg-transparent px-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-charcoal)] transition hover:bg-[rgba(30,23,18,0.04)]"
              type="submit"
            >
              Sign up with Google
            </button>
          </form>

          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_42%,white)]">
            <span className="h-px flex-1 bg-black/10" />
            Or register with email
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <form action="/auth/register" className="space-y-5" method="post">
            <Field label="Full name*" name="fullName" type="text" />
            <Field label="Email address*" name="email" type="email" />
            <Field label="Password*" minLength={8} name="password" type="password" />

            <button
              className="mt-3 inline-flex min-h-15 w-full items-center justify-center bg-[var(--color-bonita-charcoal)] px-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-ivory)] transition hover:bg-[color-mix(in_srgb,var(--color-bonita-charcoal)_90%,black)]"
              type="submit"
            >
              Create account
            </button>
          </form>
        </div>
      }
      secondaryAction={
        <div className="space-y-8">
          <h3 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-charcoal)]">
            Already registered?
          </h3>
          <Link
            className="inline-flex min-h-15 w-full items-center justify-center border border-black/12 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-bonita-charcoal)] transition hover:bg-[rgba(30,23,18,0.04)]"
            href="/login"
          >
            Sign in instead
          </Link>
        </div>
      }
      statusMessage={errorMessage}
      subtitle={
        <div className="grid max-w-3xl gap-x-16 gap-y-0.5 sm:grid-cols-2">
          <div className="space-y-0.5">
            <div className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--color-bonita-cocoa)]" />
              <span>Faster Checkout</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--color-bonita-cocoa)]" />
              <span>View Profile</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--color-bonita-cocoa)]" />
              <span>Access order history</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--color-bonita-cocoa)]" />
              <span>View Profile</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--color-bonita-cocoa)]" />
              <span>Receive email communications</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--color-bonita-cocoa)]" />
              <span>View saved addresses &amp; payments</span>
            </div>
          </div>
        </div>
      }
      title="Create Your Account"
    />
  );
}
