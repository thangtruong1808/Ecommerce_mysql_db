import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-ui-lg border border-dashed border-line bg-surface px-6 py-12 text-center">
      <h3 className="font-ui text-lg font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
