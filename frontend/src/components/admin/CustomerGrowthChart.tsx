import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CustomerGrowthPoint } from "@shared/admin";
import { useTheme } from "../../theme/ThemeProvider";
import { cssColor, prefersReducedMotion } from "../../pages/admin/dashboardFormat";

interface CustomerGrowthChartProps {
  data?: CustomerGrowthPoint[];
}

function dateLabel(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function GrowthTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { label?: string; customers?: number } }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }
  const point = payload[0].payload;
  return (
    <div className="rounded-ui-sm border border-line bg-surface p-3 text-sm text-ink shadow-ui">
      <p className="font-semibold">{point?.label}</p>
      <p className="text-success">{point?.customers || 0} new customers</p>
    </div>
  );
}

export default function CustomerGrowthChart({ data = [] }: CustomerGrowthChartProps) {
  useTheme();
  const chartData = data.map((item) => ({
    label: dateLabel(item.date || ""),
    customers: Number(item.newCustomers) || 0,
  }));
  const quiet = prefersReducedMotion();
  const stroke = cssColor("--success", "#15803d");
  const grid = cssColor("--line", "#e5e7eb");
  const tick = cssColor("--muted", "#4b5563");

  return (
    <section className="flex h-full flex-col rounded-ui border border-line bg-surface p-4 text-ink shadow-ui">
      <h2 className="mb-2 text-base font-semibold">Customer growth</h2>
      {chartData.length > 0 ? (
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: tick }}
                interval="preserveStartEnd"
                angle={chartData.length > 7 ? -40 : 0}
                textAnchor={chartData.length > 7 ? "end" : "middle"}
                height={chartData.length > 7 ? 70 : 30}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: tick }} width={32} />
              <Tooltip content={<GrowthTooltip />} />
              <Area
                type="monotone"
                dataKey="customers"
                name="New customers"
                stroke={stroke}
                fill={stroke}
                fillOpacity={0.2}
                strokeWidth={2}
                isAnimationActive={!quiet}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center text-sm text-muted">No customer growth data available</p>
      )}
    </section>
  );
}
