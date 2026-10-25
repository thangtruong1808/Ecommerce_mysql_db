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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
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
            <Link to="/orders" className="inline-flex h-10 items-center justify-center rounded-ui-sm bg-primary px-4 text-sm font-medium text-on-primary">
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/orders" className="mb-4 inline-flex text-sm font-medium text-primary hover:underline">
        Back to orders
      </Link>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Order {orderNumber(order)}</h1>
          <p className="mt-2 text-muted">Placed on {formatWhen(order.created_at)}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card title="Order items" className="lg:col-span-2">
          {items.length === 0 ? (
            <p className="text-sm text-muted">This order has no items.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                  <img
                    src={item.image_url || comingSoon}
                    alt={item.name || "Product"}
                    className="h-20 w-20 rounded-ui-sm object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.src = comingSoon;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink">{item.name}</h3>
                    <p className="text-sm text-muted">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted">{money(item.price)} each</p>
                  </div>
                  <p className="font-semibold text-ink">{money((Number(item.price) || 0) * item.quantity)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Summary" className="h-fit">
          <h3 className="font-semibold text-ink">Shipping address</h3>
          <p className="mt-2 text-sm text-muted">
            {order.address || "Not available"}
            <br />
            {[order.city, order.postal_code].filter(Boolean).join(", ") || "Not available"}
            <br />
            {order.country || "Not available"}
          </p>
          <h3 className="mt-4 font-semibold text-ink">Payment</h3>
          <p className="mt-2 text-sm text-muted">
            Method: {order.payment_method || "Not available"}
            <br />
            Status: {isYes(order.is_paid) ? "Paid" : "Pending"}
            {order.paid_at ? <><br />Paid on: {formatWhen(order.paid_at)}</> : null}
          </p>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            {voucher > 0 ? (
              <div className="flex justify-between text-success">
                <dt>Voucher discount</dt>
                <dd>-{money(voucher)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">Tax</dt>
              <dd>{money(tax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-lg font-bold text-ink">
              <dt>Total</dt>
              <dd>{money(total)}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-ui-sm border border-primary/30 bg-primary/10 p-4">
            <h3 className="font-semibold text-ink">Estimated delivery</h3>
            <p className="mt-2 text-sm text-muted">
              Your order will be delivered within 3-5 business days from the date of shipment.
              Tracking details will be sent by email once the order ships.
            </p>
          </div>
          {invoiceLoading ? <p className="mt-4 text-sm text-muted">Looking for the invoice...</p> : null}
          {invoiceError ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-danger" role="alert">{invoiceError}</p>
              <Button type="button" variant="outline" loading={invoiceLoading} onClick={() => setInvoiceReload((value) => value + 1)}>
                Try again
              </Button>
            </div>
          ) : null}
          {invoice ? (
            <Link
              to={`/invoices/${invoice.id}`}
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-ui-sm bg-primary text-sm font-medium text-on-primary hover:bg-primary-hover"
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
