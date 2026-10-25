import { cn } from "./cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-ui bg-surface-muted motion-safe:animate-pulse",
        className,
      )}
    />
  );
}
