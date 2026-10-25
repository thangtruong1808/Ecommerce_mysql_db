import { cn } from "./cn";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export function controlClass(invalid = false): string {
  return cn(
    "w-full rounded-ui-sm border bg-surface px-3 py-2 text-sm text-ink shadow-ui placeholder:text-muted",
    "disabled:cursor-not-allowed disabled:opacity-60",
    focusRing,
    invalid ? "border-danger" : "border-line",
  );
}
