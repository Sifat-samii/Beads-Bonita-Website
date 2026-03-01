import type { ReactNode } from "react";
import { cn } from "./utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "ui:flex ui:flex-col ui:gap-4 md:ui:flex-row md:ui:items-end md:ui:justify-between",
        className,
      )}
    >
      <div className="ui:max-w-2xl">
        <p className="ui:text-xs ui:font-semibold ui:uppercase ui:tracking-[0.28em] ui:text-[var(--color-bonita-moss)]">
          {eyebrow}
        </p>
        <h2 className="ui:mt-3 ui:font-[family-name:var(--font-display)] ui:text-4xl ui:leading-tight ui:text-[var(--color-bonita-charcoal)] md:ui:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="ui:mt-4 ui:max-w-xl ui:text-sm ui:leading-7 ui:text-[color-mix(in_srgb,var(--color-bonita-charcoal)_72%,white)] md:ui:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
