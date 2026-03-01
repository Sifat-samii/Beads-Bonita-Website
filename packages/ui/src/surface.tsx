import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "./utils";

export function Surface({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "ui:rounded-[2rem] ui:border ui:border-white/50 ui:bg-white/70 ui:backdrop-blur-sm ui:shadow-[var(--ui-shadow-soft)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
