import type { IconType } from "react-icons";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number | null;
  icon?: IconType;
}

export default function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const amount = Number(change);
  const hasChange = change !== undefined && change !== null && Number.isFinite(amount);
  const positive = hasChange && amount >= 0;

  return (
    <article className="min-w-0 rounded-ui-lg border border-line bg-surface p-3 text-ink shadow-ui">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-ui text-xs font-medium text-muted">{title}</h3>
          <p className="mt-1 break-words font-ui text-xl font-semibold text-ink">{value}</p>
          {hasChange ? (
            <p className={`mt-1.5 inline-flex items-center font-ui text-xs font-semibold ${positive ? "text-success" : "text-danger"}`}>
              {positive ? <FaArrowUp className="mr-1" aria-hidden="true" /> : <FaArrowDown className="mr-1" aria-hidden="true" />}
              {Math.abs(amount).toFixed(1)}%
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span className="inline-flex shrink-0 rounded-full bg-primary/15 p-2 text-primary">
            <Icon aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </article>
  );
}
