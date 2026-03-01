import { authMessages } from "@beads-bonita/core";
import { Surface } from "@beads-bonita/ui/surface";

function resolveMessage(searchParams: Record<string, string | string[] | undefined>) {
  if (searchParams.error === "credentials") {
    return authMessages.invalidCredentials;
  }

  if (searchParams.error === "oauth") {
    return authMessages.oauthFailed;
  }

  if (searchParams.error === "admin") {
    return authMessages.adminAccessRequired;
  }

  if (searchParams.message === "signedout") {
    return authMessages.signedOut;
  }

  return null;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusMessage = resolveMessage(params);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-bonita-rose)]">
            Restricted access
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-bonita-ivory)]">
            Admin login
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/70">
            Use an account whose `profiles.role` value is set to `admin` in
            Supabase.
          </p>
        </Surface>

        <Surface className="border-white/10 bg-white/8 p-8 text-white shadow-none">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-bonita-ivory)]">
            Sign in to dashboard
          </h2>
          {statusMessage ? (
            <div className="mt-6 rounded-2xl border border-white/15 bg-black/10 px-4 py-3 text-sm text-[var(--color-bonita-ivory)]">
              {statusMessage}
            </div>
          ) : null}
          <form action="/auth/google" className="mt-6" method="post">
            <button
              className="w-full rounded-full border border-white/15 bg-black/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bonita-ivory)]"
              type="submit"
            >
              Continue with Google
            </button>
          </form>
          <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/55">
            <span className="h-px flex-1 bg-white/15" />
            Or use email
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <form action="/auth/login" className="mt-6 space-y-4" method="post">
            <label className="block space-y-2 text-sm">
              <span>Email</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Password</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none"
                name="password"
                required
                type="password"
              />
            </label>
            <button
              className="w-full rounded-full bg-[var(--color-bonita-ivory)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-bonita-charcoal)]"
              type="submit"
            >
              Login to admin
            </button>
          </form>
        </Surface>
      </div>
    </main>
  );
}
