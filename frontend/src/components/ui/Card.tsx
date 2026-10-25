import type { ReactNode } from "react";
import { cn } from "./cn";

interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, actions, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-ui-lg border border-line bg-surface text-ink shadow-ui",
        className,
      )}
    >
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="font-ui text-base font-semibold">{title}</h2>
          {actions}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}
