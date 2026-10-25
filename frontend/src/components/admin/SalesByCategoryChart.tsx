import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryRevenue } from "@shared/admin";
import { useTheme } from "../../theme/ThemeProvider";
import { cssColor, money, prefersReducedMotion } from "../../pages/admin/dashboardFormat";

const slices = [
  { token: "--primary", fallback: "#1f6b4a" },
  { token: "--secondary", fallback: "#c4a15a" },
  { token: "--warning", fallback: "#926014" },
  { token: "--info", fallback: "#245c54" },
  { token: "--danger", fallback: "#9f2d2d" },
];

interface SalesByCategoryChartProps {
  data?: CategoryRevenue[];
}

function CategoryTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  total: number;
}) {
  if (!active || !payload?.length) {
    return null;
  }
  const point = payload[0];
  const value = Number(point.value) || 0;
  const share = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="rounded-ui-sm border border-line bg-surface p-3 text-sm text-ink shadow-ui">
      <p className="font-semibold">{point.name}</p>
      <p className="text-primary">{money(value)}</p>
      <p className="text-muted">{share}% of total</p>
    </div>
  );
}

export default function SalesByCategoryChart({ data = [] }: SalesByCategoryChartProps) {
  useTheme();
  const chartData = data.map((item) => ({
    name: item.name || "Unknown",
    value: Number(item.revenue) || 0,
  }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const quiet = prefersReducedMotion();
  const colors = chartData.map((_, index) => {
    const slice = slices[index % slices.length];
    return cssColor(slice.token, slice.fallback);
  });

  return (
    <section className="flex min-w-0 flex-col rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui">
      <h2 className="mb-2 font-ui text-base font-semibold">Sales by category</h2>
      {chartData.length > 0 ? (
        <>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={72}
                  paddingAngle={1}
                  isAnimationActive={!quiet}
                  label={false}
                  labelLine={false}
                  stroke={cssColor("--surface", "#fffcf7")}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2">
            {chartData.map((entry, index) => {
              const share = total > 0 ? `${((entry.value / total) * 100).toFixed(0)}%` : "0%";
              return (
                <li key={`${entry.name}-${index}`} className="flex min-w-0 items-start gap-2 font-ui text-sm text-ink">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index] }} />
                  <span className="min-w-0 flex-1 break-words">{entry.name}</span>
                  <span className="shrink-0 text-muted">{share}</span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="flex flex-1 items-center justify-center text-sm text-muted">No category data available</p>
      )}
    </section>
  );
}
