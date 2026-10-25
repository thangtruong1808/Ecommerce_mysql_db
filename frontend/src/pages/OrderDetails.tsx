import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import type { OrderItem } from "@shared/commerce";
import comingSoon from "../assets/images/image_comming_soon.png";
import { Badge, Button, Card, EmptyState, Skeleton } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";
import {
  formatWhen,
  isYes,
  messageFrom,
  money,
  orderNumber,
  orderStatus,
  type OrderListItem,
} from "./orders/format";

interface CustomerOrder extends OrderListItem {
  items?: OrderItem[];
}

interface InvoiceLink {
  id: number;
  order_id: number;
}

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [invoice, setInvoice] = useState<InvoiceLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceReload, setInvoiceReload] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  usePageTitle(order ? `Order ${orderNumber(order)}` : "Order Details");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);
      setOrder(null);
      setInvoice(null);
      try {
        const response = await axios.get<CustomerOrder>(`/api/orders/${id}`);
        if (!active) return;
        setOrder(response.data);
      } catch (loadError) {
        if (!active) return;
        if (axios.isAxiosError(loadError) && loadError.response?.status === 404) {
          setNotFound(true);
          return;
        }
        setError(messageFrom(loadError, "Failed to load order details"));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    if (!order) return undefined;
    let active = true;
    const loadInvoice = async () => {
      setInvoiceLoading(true);
      try {
        const response = await axios.get<{ invoices?: unknown }>("/api/invoices", {
          params: { order_id: order.id },
        });
        if (!active) return;
        const invoices = Array.isArray(response.data.invoices) ? response.data.invoices as InvoiceLink[] : [];
        const match = invoices.find((item) => Number(item.order_id) === Number(order.id));
        setInvoice(match || null);
        if (!Array.isArray(response.data.invoices)) {
          setInvoiceError("Invoice could not be loaded.");
        } else {
          setInvoiceError("");
        }
      } catch (loadError) {
        if (!active) return;
        setInvoiceError(messageFrom(loadError, "Failed to load invoice"));
      } finally {
        if (active) setInvoiceLoading(false);
      }
    };
    void loadInvoice();
    return () => {
      active = false;
    };
  }, [order, invoiceReload]);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <p className="sr-only">Loading order details</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Order not found"
          description="This order is not on your account."
          action={
            <Link to="/orders" className="inline-flex h-12 items-center justify-center rounded-ui bg-primary px-5 font-ui text-sm font-semibold text-on-primary hover:bg-primary-hover">
              Back to orders
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Order could not be loaded"
          description={error || "Failed to load order details"}
          action={
            <Button type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const status = orderStatus(order);
  const total = Number(order.total_price) || 0;
  const tax = Number(order.tax_price) || 0;
  const shipping = Number(order.shipping_price) || 0;
  const voucher = Number(order.voucher_discount) || 0;
  const subtotal = total - tax - shipping + voucher;
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link to="/orders" className="mb-4 inline-flex rounded-ui font-ui text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        Back to orders
      </Link>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words font-display text-4xl text-ink">Order {orderNumber(order)}</h1>
          <p className="mt-2 font-ui text-sm text-muted">Placed on {formatWhen(order.created_at)}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <Card title="Order items">
            {items.length === 0 ? (
              <p className="font-ui text-sm text-muted">This order has no items.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex min-w-0 flex-wrap items-center gap-4 rounded-ui-lg bg-canvas p-4">
                    <img
                      src={item.image_url || comingSoon}
                      alt={item.name || "Product"}
                      className="h-20 w-20 rounded-ui object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.src = comingSoon;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-ui font-semibold text-ink">{item.name}</h3>
                      <p className="font-ui text-sm text-muted">Quantity: {item.quantity}</p>
                      <p className="font-ui text-sm text-secondary">{money(item.price)} each</p>
                    </div>
                    <p className="font-ui font-semibold text-secondary">{money((Number(item.price) || 0) * item.quantity)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Shipping address">
            <p className="break-words font-ui text-sm text-ink">
              {order.address || "Not available"}
              <br />
              {[order.city, order.postal_code].filter(Boolean).join(", ") || "Not available"}
              <br />
              {order.country || "Not available"}
            </p>
          </Card>
        </div>
        <Card title="Summary" className="h-fit min-w-0 lg:sticky lg:top-28">
          <h3 className="font-ui font-semibold text-ink">Payment</h3>
          <p className="mt-2 font-ui text-sm text-muted">
            Method: {order.payment_method || "Not available"}
            <br />
            Status: {isYes(order.is_paid) ? "Paid" : "Pending"}
            {order.paid_at ? <><br />Paid on: {formatWhen(order.paid_at)}</> : null}
          </p>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 font-ui text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">{money(subtotal)}</dd>
            </div>
            {voucher > 0 ? (
              <div className="flex justify-between gap-3 text-success">
                <dt>Voucher discount</dt>
                <dd>-{money(voucher)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Tax</dt>
              <dd className="text-ink">{money(tax)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-ink">{money(shipping)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-line pt-3 text-lg font-semibold">
              <dt className="text-ink">Total</dt>
              <dd className="text-secondary">{money(total)}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-ui-lg bg-canvas p-4">
            <h3 className="font-ui font-semibold text-ink">Estimated delivery</h3>
            <p className="mt-2 font-ui text-sm text-muted">
              Your order will be delivered within 3-5 business days from the date of shipment.
              Tracking details will be sent by email once the order ships.
            </p>
          </div>
          {invoiceLoading ? <p className="mt-4 font-ui text-sm text-muted">Looking for the invoice...</p> : null}
          {invoiceError ? (
            <div className="mt-4 space-y-3">
              <p className="font-ui text-sm text-danger" role="alert">{invoiceError}</p>
              <Button type="button" variant="outline" loading={invoiceLoading} onClick={() => setInvoiceReload((value) => value + 1)}>
                Try again
              </Button>
            </div>
          ) : null}
          {invoice ? (
            <Link
              to={`/invoices/${invoice.id}`}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-ui bg-primary font-ui text-sm font-semibold text-on-primary hover:bg-primary-hover"
            >
              View invoice
            </Link>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

export default OrderDetails;
