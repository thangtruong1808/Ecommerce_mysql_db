import type { ReactNode } from "react";
import { cn } from "./cn";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "promo"
  | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-surface-muted text-ink",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-ink",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-ink",
  danger: "bg-danger/15 text-danger",
  promo: "border-transparent bg-danger text-on-danger",
  info: "bg-info/15 text-info",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/15 px-2.5 py-1 font-ui text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
