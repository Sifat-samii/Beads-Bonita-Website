import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "ui:bg-[var(--color-bonita-charcoal)] ui:text-[var(--color-bonita-ivory)] hover:ui:bg-[color-mix(in_srgb,var(--color-bonita-charcoal)_88%,black)]",
  secondary:
    "ui:bg-[var(--color-bonita-sand)] ui:text-[var(--color-bonita-charcoal)] hover:ui:bg-[color-mix(in_srgb,var(--color-bonita-sand)_88%,white)]",
  ghost:
    "ui:bg-transparent ui:text-[var(--color-bonita-charcoal)] hover:ui:bg-white/40",
};

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "ui:inline-flex ui:items-center ui:justify-center ui:rounded-full ui:px-5 ui:py-3 ui:text-sm ui:font-semibold ui:tracking-[0.18em] ui:uppercase ui:transition ui:duration-300",
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
