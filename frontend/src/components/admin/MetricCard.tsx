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
  const iconTone = !hasChange
    ? "bg-primary/10 text-primary"
    : positive
      ? "bg-success/15 text-success"
      : "bg-danger/15 text-danger";

  return (
    <article className="rounded-ui border border-line bg-surface p-3 text-ink shadow-ui">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xs font-medium text-muted">{title}</h3>
          <p className="mt-1 text-xl font-bold">{value}</p>
          {hasChange ? (
            <p className={`mt-1.5 inline-flex items-center text-xs font-semibold ${positive ? "text-success" : "text-danger"}`}>
              {positive ? <FaArrowUp className="mr-1" aria-hidden="true" /> : <FaArrowDown className="mr-1" aria-hidden="true" />}
              {Math.abs(amount).toFixed(1)}%
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span className={`inline-flex rounded-full p-2 ${iconTone}`}>
            <Icon aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </article>
  );
}
