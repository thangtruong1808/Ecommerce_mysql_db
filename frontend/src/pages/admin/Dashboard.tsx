import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { StatsPeriod } from "@shared/common";
import type {
  ActivityItem,
  CategoryRevenue,
  CustomerGrowthPoint,
  DashboardOverview,
  PerformanceMetrics,
  TopProductStat,
} from "@shared/admin";
import {
  FaBox,
  FaChartLine,
  FaDollarSign,
  FaExclamationTriangle,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import CustomerGrowthChart from "../../components/admin/CustomerGrowthChart";
import MetricCard from "../../components/admin/MetricCard";
import PeriodFilter from "../../components/admin/PeriodFilter";
import SalesByCategoryChart from "../../components/admin/SalesByCategoryChart";
import { Badge, Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import {
  fetchCustomerInsights,
  fetchDashboardOverview,
  fetchPerformanceMetrics,
  fetchRecentActivity,
  fetchSalesByCategory,
  fetchTopProducts,
} from "../../utils/dashboardApi";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { ensureValidAccessToken } from "../../utils/tokenUtils";
import { activityWhen, isYes, messageFrom, money, orderNumber } from "./dashboardFormat";

function activityIcon(type: string): string {
  if (type === "order") return "🛒";
  if (type === "review") return "⭐";
  if (type === "comment") return "💬";
  if (type === "registration") return "👤";
  return "📦";
}

export default function Dashboard() {
  usePageTitle("Admin Dashboard");
  const [period, setPeriod] = useState<StatsPeriod>("all");
  const [stats, setStats] = useState<DashboardOverview | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryRevenue[]>([]);
  const [customerGrowthData, setCustomerGrowthData] = useState<CustomerGrowthPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductStat[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await ensureValidAccessToken();
      const [overview, categories, customers, products, activity, performance] = await Promise.allSettled([
        fetchDashboardOverview(period),
        fetchSalesByCategory(period),
        fetchCustomerInsights(period),
        fetchTopProducts(period, 10),
        fetchRecentActivity(15),
        fetchPerformanceMetrics(period),
      ]);

      if (overview.status === "fulfilled" && overview.value) setStats(overview.value);
      if (categories.status === "fulfilled") setCategoryData(categories.value || []);
      if (customers.status === "fulfilled") setCustomerGrowthData(customers.value?.growthData || []);
      if (products.status === "fulfilled") setTopProducts(products.value || []);
      if (activity.status === "fulfilled") setRecentActivities(activity.value || []);
      if (performance.status === "fulfilled") setPerformanceMetrics(performance.value);

      const rejected = [overview, categories, customers, products, activity, performance].filter(
        (result) => result.status === "rejected",
      );
      const firstError = rejected[0];
      const message =
        firstError?.status === "rejected"
          ? messageFrom(firstError.reason, "The dashboard could not be loaded.")
          : "The dashboard could not be loaded.";
      const overviewOk = overview.status === "fulfilled" && Boolean(overview.value);

      if (!overviewOk && !stats) {
        setError(message);
      } else {
        setError("");
        if (overviewOk || stats) {
          setLastUpdated(new Date());
        }
        if (rejected.length > 0 && !(firstError?.status === "rejected" && shouldSuppress401Toast(firstError.reason))) {
          toast.error(overviewOk || stats ? "Some dashboard figures could not be loaded." : message);
        }
      }
    } catch (requestError: unknown) {
      if (!shouldSuppress401Toast(requestError)) {
        setError(messageFrom(requestError, "The dashboard could not be loaded."));
      }
    } finally {
      setLoading(false);
    }
  }, [period, reloadKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const intervalId = window.setInterval(() => void load(), 5 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, [load]);

  const revenue = Number(stats?.sales?.total) || 0;
  const orders = Number(stats?.orders?.total) || 0;
  const productsTotal = Number(stats?.products?.total) || 0;
  const averageOrder = Number(performanceMetrics?.aov) || (orders > 0 ? revenue / orders : 0);
  const conversion = Number(performanceMetrics?.conversionRate) || 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-ui text-3xl font-semibold text-ink">Admin dashboard</h1>
            {lastUpdated ? (
              <p className="mt-1 font-ui text-sm text-muted">Updated {lastUpdated.toLocaleTimeString()}</p>
            ) : null}
          </div>
          <PeriodFilter period={period} onPeriodChange={setPeriod} disabled={loading} />
        </div>

        {loading && !stats ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
            <p className="sr-only">Loading dashboard</p>
          </div>
        ) : null}

        {error && !stats ? (
          <EmptyState
            title="Dashboard could not be loaded"
            description={error}
            action={
              <Button type="button" loading={loading} onClick={() => setReloadKey((value) => value + 1)}>
                Try again
              </Button>
            }
          />
        ) : null}

        {stats ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6" aria-busy={loading || undefined}>
              <MetricCard title="Total revenue" value={money(revenue)} change={performanceMetrics?.revenueGrowth} icon={FaDollarSign} />
              <MetricCard title="Total orders" value={orders} change={performanceMetrics?.ordersGrowth} icon={FaShoppingCart} />
              <MetricCard title="New customers" value={performanceMetrics?.newCustomers || 0} change={performanceMetrics?.customersGrowth} icon={FaUsers} />
              <MetricCard title="Average order" value={money(averageOrder)} change={performanceMetrics?.aovGrowth} icon={FaChartLine} />
              <MetricCard title="Conversion rate" value={`${conversion.toFixed(1)}%`} change={performanceMetrics?.conversionGrowth} icon={FaChartLine} />
              <MetricCard title="Total products" value={productsTotal} icon={FaBox} />
            </div>

            <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
              <SalesByCategoryChart data={categoryData} />
              <CustomerGrowthChart data={customerGrowthData} />
            </div>

            <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
              <section className="min-w-0 rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui">
                <h2 className="font-ui text-base font-semibold">Top selling products</h2>
                {topProducts.length > 0 ? (
                  <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                    {topProducts.map((product) => (
                      <li key={product.id}>
                        <Link to={`/products/${product.id}`} className="flex min-w-0 items-center justify-between gap-3 rounded-ui-sm p-2 hover:bg-surface-muted">
                          <span className="min-w-0 break-words font-ui text-sm font-medium text-primary">{product.name}</span>
                          <span className="shrink-0 font-ui text-sm text-muted">
                            {product.unitsSold || 0} sold · {money(product.revenue)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No product data available</p>
                )}
              </section>

              <section className="min-w-0 rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui">
                <h2 className="font-ui text-base font-semibold">Recent orders</h2>
                {stats.recentOrders?.length ? (
                  <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                    {stats.recentOrders.map((order) => {
                      const delivered = isYes(order.is_delivered);
                      const paid = isYes(order.is_paid);
                      const label = delivered ? "Delivered" : paid ? "Paid" : "Pending";
                      const variant = delivered ? "success" : paid ? "primary" : "warning";
                      return (
                        <li key={order.id}>
                          <Link to={`/orders/${order.id}`} className="block min-w-0 rounded-ui-sm border border-line p-3 hover:bg-surface-muted">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="break-words font-ui font-medium">{orderNumber(order)}</p>
                                <p className="break-words font-ui text-sm text-muted">{order.user_name || "Customer"}</p>
                                <p className="mt-1 text-xs text-muted">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Not available"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{money(order.total_price)}</p>
                                <Badge variant={variant}>{label}</Badge>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No recent orders</p>
                )}
              </section>
            </div>

            <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
              <section className="flex h-80 min-w-0 flex-col rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui">
                <h2 className="flex items-center gap-2 font-ui text-base font-semibold">
                  <FaExclamationTriangle className="text-warning" aria-hidden="true" />
                  Low stock products
                </h2>
                {stats.lowStockProducts?.length ? (
                  <ul className="mt-3 flex-1 space-y-2 overflow-y-auto">
                    {stats.lowStockProducts.map((product) => (
                      <li key={product.id}>
                        <Link to={`/products/${product.id}`} className="block min-w-0 rounded-ui-sm border border-line p-3 hover:bg-surface-muted">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words font-ui font-medium">{product.name}</p>
                              <p className="text-sm text-muted">
                                Current stock: <span className="font-semibold text-danger">{product.stock}</span>
                              </p>
                            </div>
                            <Badge variant="danger">Low stock</Badge>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">All products are well stocked</p>
                )}
              </section>

              <section className="flex h-80 min-w-0 flex-col rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui">
                <h2 className="font-ui text-base font-semibold">Recent activity</h2>
                {recentActivities.length > 0 ? (
                  <ul className="mt-3 flex-1 space-y-2 overflow-y-auto">
                    {recentActivities.map((activity) => (
                      <li key={`${activity.type}-${activity.id}`} className="flex gap-2 border-b border-line pb-2 last:border-0">
                        <span aria-hidden="true">{activityIcon(String(activity.type))}</span>
                        <div className="min-w-0">
                          <p className="break-words font-ui text-sm">{activity.description || activity.title || "Activity"}</p>
                          <p className="text-xs text-muted">{activityWhen(activity.createdAt)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No recent activity</p>
                )}
              </section>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
