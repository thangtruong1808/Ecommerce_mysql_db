import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Badge, Button, EmptyState, Skeleton } from "../components/ui";
import Pagination from "../components/Pagination";
import usePageTitle from "../hooks/usePageTitle";
import {
  formatWhen,
  isYes,
  messageFrom,
  money,
  pageInfo,
  type PageInfo,
} from "./orders/format";
import type { DecimalValue, SqlBoolean } from "@shared/common";

interface InvoiceListItem {
  id: number;
  invoice_number?: string;
  order_id?: number;
  order_number?: string | null;
  created_at?: string;
  total_amount?: DecimalValue;
  email_sent?: SqlBoolean;
}

function orderLabel(invoice: InvoiceListItem): string {
  if (invoice.order_number) return invoice.order_number;
  const date = invoice.created_at ? new Date(invoice.created_at) : null;
  const datePart = date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10).replace(/-/g, "")
    : "00000000";
  return `ORD-${datePart}-${String(invoice.order_id || 0).padStart(5, "0")}`;
}

function InvoiceList() {
  usePageTitle("My Invoices");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
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
        const response = await axios.get<{ invoices?: unknown; pagination?: Partial<PageInfo> }>("/api/invoices", {
          params: { page },
        });
        if (!active) return;
        if (!Array.isArray(response.data.invoices)) {
          setInvoices([]);
          setError("Invoices could not be loaded.");
          return;
        }
        const info = pageInfo(response.data.pagination, page);
        if (info.pages > 0 && page > info.pages) {
          setSearchParams({ page: String(info.pages) });
          return;
        }
        setInvoices(response.data.invoices as InvoiceListItem[]);
        setPagination(info);
      } catch (loadError) {
        if (!active) return;
        setInvoices([]);
        setError(messageFrom(loadError, "Failed to load invoices"));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [page, reloadKey, setSearchParams]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-4xl text-ink">My invoices</h1>
        <p className="mt-2 font-ui text-sm text-muted">Invoices created after an order is paid.</p>
      </header>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <p className="sr-only">Loading invoices</p>
        </div>
      ) : null}
      {!loading && error ? (
        <EmptyState
          title="Invoices could not be loaded"
          description={error}
          action={<Button type="button" onClick={() => setReloadKey((value) => value + 1)}>Try again</Button>}
        />
      ) : null}
      {!loading && !error && invoices.length === 0 ? (
        <EmptyState
          title="You don't have any invoices yet"
          description="An invoice is created after an order is paid."
          action={
            <Link
              to="/products"
              className="inline-flex h-12 items-center justify-center rounded-ui bg-primary px-5 font-ui text-sm font-semibold text-on-primary hover:bg-primary-hover"
            >
              Browse products
            </Link>
          }
        />
      ) : null}
      {!loading && !error && invoices.length > 0 ? (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="block min-w-0 rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:p-5"
            >
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="break-words font-ui text-lg font-semibold">Invoice {invoice.invoice_number || invoice.id}</h2>
                    {isYes(invoice.email_sent) ? <Badge variant="success">Email sent</Badge> : null}
                  </div>
                  <p className="mt-2 break-words font-ui text-sm text-muted">
                    Order {orderLabel(invoice)} · {formatWhen(invoice.created_at)}
                  </p>
                </div>
                <p className="shrink-0 font-ui text-xl font-semibold text-secondary">{money(invoice.total_amount)}</p>
              </div>
            </Link>
          ))}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            limit={pagination.limit}
            total={pagination.total}
            onPageChange={(next) => setSearchParams(next <= 1 ? {} : { page: String(next) })}
          />
        </div>
      ) : null}
    </div>
  );
}

export default InvoiceList;
