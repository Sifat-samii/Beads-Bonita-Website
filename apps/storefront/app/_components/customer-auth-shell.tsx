import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@beads-bonita/core";

type AuthMode = "login" | "register";

function getTabClass(isActive: boolean) {
  return isActive
    ? "border-b border-[var(--color-bonita-charcoal)] text-[var(--color-bonita-charcoal)]"
    : "border-b border-transparent text-[color-mix(in_srgb,var(--color-bonita-charcoal)_50%,white)] hover:text-[var(--color-bonita-charcoal)]";
}

export function CustomerAuthShell({
  mode,
  title,
  subtitle,
  statusMessage,
  formTitle,
  formDescription,
  primaryForm,
  secondaryAction,
}: {
  mode: AuthMode;
  title: ReactNode;
  subtitle: ReactNode;
  statusMessage?: string | null;
  formTitle: string;
  formDescription: string;
  primaryForm: ReactNode;
  secondaryAction: ReactNode;
}) {
  return (
    <main className="page-shell min-h-screen bg-[#f5f1ec] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1600px] overflow-hidden rounded-[2rem] border border-black/5 bg-[#f8f5f0] shadow-[0_30px_90px_rgba(38,29,21,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(180deg,#e8f0eb_0%,#d8e8df_34%,#f4ece1_100%)] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(142,173,158,0.28),transparent_34%),radial-gradient(circle_at_70%_28%,rgba(210,184,162,0.26),transparent_30%)]" />
          <div className="relative flex h-full flex-col px-14 py-12">
            <div className="max-w-4xl space-y-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--color-bonita-moss)]">
                {brand.name}
              </p>
              <div className="space-y-4">
                <h1 className="font-[family-name:var(--font-display)] text-[4rem] leading-[0.95] text-[var(--color-bonita-charcoal)]">
                  {title}
                </h1>
                <div className="max-w-2xl text-sm leading-7 text-[color-mix(in_srgb,var(--color-bonita-charcoal)_70%,white)]">
                  {subtitle}
                </div>
              </div>
            </div>

            <div
              className={`relative mx-auto flex w-full max-w-[31rem] items-end justify-center pb-4 ${
                mode === "register" ? "mt-2 pt-6" : "mt-[44px] pt-12"
              }`}
            >
              <div className="relative h-[29.5rem] w-[26rem] overflow-hidden rounded-[2.4rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.14))] p-5 shadow-[0_45px_90px_rgba(45,78,72,0.24)] backdrop-blur-[22px]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08))]" />
                <div className="absolute inset-x-12 top-5 h-12 rounded-full bg-white/30 blur-[24px]" />
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/40 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <Image
                    alt="BEADS BONITA logo artwork"
                    className="h-full w-full object-cover opacity-75"
                    fill
                    priority
                    sizes="(max-width: 1024px) 0px, 416px"
                    src="/api/assets/logo"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%,rgba(255,255,255,0.08)_100%)]" />
                  <div className="absolute inset-x-8 top-8 h-10 rounded-full bg-white/22 blur-[18px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-full flex-col bg-[#fbf9f5]">
          <div className="flex-1 px-6 py-6 sm:px-10 sm:py-8 lg:px-14 lg:py-7">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
              <div className="flex items-center justify-between gap-4">
                <Link
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(30,23,18,0.03)] text-2xl leading-none text-[var(--color-bonita-charcoal)] transition hover:bg-[rgba(30,23,18,0.08)]"
                  href="/"
                >
                  x
                </Link>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[color-mix(in_srgb,var(--color-bonita-charcoal)_42%,white)] lg:hidden">
                  {brand.name}
                </p>
              </div>

              <div className="mt-4 flex gap-8 border-b border-black/10 text-xl sm:text-[1.72rem]">
                <Link
                  className={`pb-5 font-[family-name:var(--font-display)] transition ${getTabClass(mode === "login")}`}
                  href="/login"
                >
                  Sign In
                </Link>
                <Link
                  className={`pb-5 font-[family-name:var(--font-display)] transition ${getTabClass(mode === "register")}`}
                  href="/register"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-8 lg:mt-12">
                {statusMessage ? (
                  <div className="rounded-[1.25rem] border border-[rgba(107,78,58,0.14)] bg-[rgba(255,255,255,0.78)] px-5 py-4 text-sm leading-7 text-[var(--color-bonita-cocoa)]">
                    {statusMessage}
                  </div>
                ) : null}

                <div className={statusMessage ? "mt-10" : ""}>{primaryForm}</div>

                <div className="mt-14 border-t border-black/10 pt-10">
                  {secondaryAction}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}











