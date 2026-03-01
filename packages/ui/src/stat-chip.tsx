import { cn } from "./utils";

export function StatChip({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ui:rounded-full ui:border ui:border-[color-mix(in_srgb,var(--color-bonita-charcoal)_10%,white)] ui:bg-white/60 ui:px-4 ui:py-3",
        className,
      )}
    >
      <p className="ui:text-[0.7rem] ui:font-semibold ui:uppercase ui:tracking-[0.22em] ui:text-[var(--color-bonita-moss)]">
        {label}
      </p>
      <p className="ui:mt-1 ui:text-lg ui:font-semibold ui:text-[var(--color-bonita-charcoal)]">
        {value}
      </p>
    </div>
  );
}
