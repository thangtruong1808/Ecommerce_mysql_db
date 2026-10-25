import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryRevenue } from "@shared/admin";
import { useTheme } from "../../theme/ThemeProvider";
import { cssColor, money, prefersReducedMotion } from "../../pages/admin/dashboardFormat";

const slices = ["--primary", "--success", "--warning", "--info", "--danger", "--secondary"];

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

  return (
    <section className="flex h-full flex-col rounded-ui border border-line bg-surface p-4 text-ink shadow-ui">
      <h2 className="mb-2 text-base font-semibold">Sales by category</h2>
      {chartData.length > 0 ? (
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                paddingAngle={1}
                isAnimationActive={!quiet}
                label={({ name, percent }) =>
                  Number(percent) > 0.05 ? `${name}: ${((Number(percent) || 0) * 100).toFixed(0)}%` : ""
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={cssColor(slices[index % slices.length], "#2563eb")} />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip total={total} />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center text-sm text-muted">No category data available</p>
      )}
    </section>
  );
}
