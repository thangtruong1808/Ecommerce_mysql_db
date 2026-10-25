import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Badge, Button, EmptyState, Skeleton } from "../components/ui";
import Pagination from "../components/Pagination";
import usePageTitle from "../hooks/usePageTitle";
import {
  formatWhen,
  messageFrom,
  money,
  orderNumber,
  orderStatus,
  pageInfo,
  type OrderListItem,
  type PageInfo,
} from "./orders/format";

function OrderHistory() {
  usePageTitle("Order History");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState<PageInfo>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<{ orders?: unknown; pagination?: Partial<PageInfo> }>("/api/orders", {
          params: { page },
        });
        if (!active) return;
        if (!Array.isArray(response.data.orders)) {
          setOrders([]);
          setError("Orders could not be loaded.");
          return;
        }
        const info = pageInfo(response.data.pagination, page);
        if (info.pages > 0 && page > info.pages) {
          setSearchParams({ page: String(info.pages) });
          return;
        }
        setOrders(response.data.orders as OrderListItem[]);
        setPagination(info);
      } catch (loadError) {
        if (!active) return;
        setOrders([]);
        setError(messageFrom(loadError, "Failed to load orders"));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [page, reloadKey, setSearchParams]);

  const changePage = (next: number) => {
    setSearchParams(next <= 1 ? {} : { page: String(next) });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-ink">Order history</h1>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <p className="sr-only">Loading orders</p>
        </div>
      ) : null}
      {!loading && error ? (
        <EmptyState
          title="Orders could not be loaded"
          description={error}
          action={
            <Button type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Try again
            </Button>
          }
        />
      ) : null}
      {!loading && !error && orders.length === 0 ? (
        <EmptyState
          title="You haven't placed any orders yet"
          description="Orders you place will show up here."
          action={
            <Link
              to="/products"
              className="inline-flex h-10 items-center justify-center rounded-ui-sm bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
            >
              Browse products
            </Link>
          }
        />
      ) : null}
      {!loading && !error && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = orderStatus(order);
            const count = Number(order.item_count) || 0;
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-ui border border-line bg-surface p-4 text-ink shadow-ui hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">Order {orderNumber(order)}</h2>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted">Placed on {formatWhen(order.created_at)}</p>
                    <p className="text-sm text-muted">{count === 1 ? "1 item" : `${count} items`}</p>
                  </div>
                  <p className="text-xl font-bold text-primary">{money(order.total_price)}</p>
                </div>
              </Link>
            );
          })}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            limit={pagination.limit}
            total={pagination.total}
            onPageChange={changePage}
          />
        </div>
      ) : null}
    </div>
  );
}

export default OrderHistory;
