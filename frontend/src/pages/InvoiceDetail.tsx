import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import type { OrderItem } from "@shared/commerce";
import type { DecimalValue } from "@shared/common";
import comingSoon from "../assets/images/image_comming_soon.png";
import logoImage from "../assets/images/Logo.png";
import { Button, EmptyState, Skeleton } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";
import { formatWhen, messageFrom, money } from "./orders/format";
import { addressLines, downloadMessage } from "./invoices/format";

interface CustomerInvoice {
  id: number;
  invoice_number?: string;
  order_id?: number;
  order_number?: string | null;
  created_at?: string;
  subtotal?: DecimalValue;
  tax_amount?: DecimalValue;
  shipping_amount?: DecimalValue;
  total_amount?: DecimalValue;
  payment_method?: string | null;
  payment_status?: string | null;
  billing_address?: unknown;
  shipping_address?: unknown;
  items?: OrderItem[];
}

function orderLabel(invoice: CustomerInvoice): string {
  if (invoice.order_number) return invoice.order_number;
  const date = invoice.created_at ? new Date(invoice.created_at) : null;
  const datePart = date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10).replace(/-/g, "")
    : "00000000";
  return `ORD-${datePart}-${String(invoice.order_id || 0).padStart(5, "0")}`;
}

function AddressBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">
        {addressLines(value).map((line, index) => (
          <span key={`${index}-${line}`} className="block">{line}</span>
        ))}
      </p>
    </div>
  );
}

function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<CustomerInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  usePageTitle(invoice?.invoice_number ? `Invoice #${invoice.invoice_number}` : "Invoice Detail");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);
      setInvoice(null);
      const invoiceId = Number(id);
      if (!Number.isInteger(invoiceId) || invoiceId < 1) {
        if (active) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }
      try {
        const response = await axios.get<CustomerInvoice>(`/api/invoices/${invoiceId}`);
        if (!active) return;
        setInvoice(response.data);
      } catch (loadError) {
        if (!active) return;
        if (axios.isAxiosError(loadError) && loadError.response?.status === 404) {
          setNotFound(true);
          return;
        }
        setError(messageFrom(loadError, "Failed to load invoice"));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const downloadPdf = async () => {
    if (downloading || !invoice) return;
    setDownloading(true);
    setDownloadError("");
    try {
      const response = await axios.get<Blob>(`/api/invoices/${invoice.id}/download`, {
        responseType: "blob",
        withCredentials: true,
      });
      const type = String(response.headers["content-type"] || "");
      if (type.includes("json")) {
        const text = await response.data.text();
        const data = JSON.parse(text) as { message?: string };
        throw new Error(data.message || "Failed to download invoice");
      }
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoice_number || invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully!");
    } catch (downloadFailure) {
      const message = await downloadMessage(downloadFailure);
      setDownloadError(message);
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Skeleton className="h-96" />
        <p className="sr-only">Loading invoice</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Invoice not found"
          description="This invoice is not on your account."
          action={
            <Link to="/invoices" className="inline-flex h-10 items-center justify-center rounded-ui-sm bg-primary px-4 text-sm font-medium text-on-primary">
              Back to invoices
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Invoice could not be loaded"
          description={error || "Failed to load invoice"}
          action={<Button type="button" onClick={() => setReloadKey((value) => value + 1)}>Try again</Button>}
        />
      </div>
    );
  }

  const items = Array.isArray(invoice.items) ? invoice.items : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/invoices" className="mb-4 inline-flex text-sm font-medium text-primary hover:underline">
        Back to invoices
      </Link>
      <article className="rounded-ui border border-line bg-surface p-4 text-ink shadow-ui sm:p-8">
        <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start">
          <img src={logoImage} alt="Badminton Stores" className="h-20 w-auto max-w-full object-contain" />
          <div>
            <h2 className="text-2xl font-bold">Ecommerce Store</h2>
            <p className="mt-1 text-sm text-muted">Your trusted online shopping destination.</p>
            <p className="mt-2 text-xs text-muted">ABN: 12 345 678 901</p>
            <p className="text-xs text-muted">123 Main Street, Melbourne Victoria 3000, Australia</p>
            <p className="text-xs text-muted">Email: thangtruong1808@gmail.com | Phone: 0466828649</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoice</h1>
            <p className="mt-2 text-muted">Invoice number: {invoice.invoice_number || invoice.id}</p>
          </div>
          <div className="text-sm text-muted sm:text-right">
            <p>Date: {formatWhen(invoice.created_at)}</p>
            {invoice.order_id ? (
              <Link to={`/orders/${invoice.order_id}`} className="text-primary hover:underline">
                Order {orderLabel(invoice)}
              </Link>
            ) : (
              <p>Order {orderLabel(invoice)}</p>
            )}
            <Button type="button" className="mt-4 w-full sm:w-auto" loading={downloading} onClick={() => void downloadPdf()}>
              Download PDF
            </Button>
            {downloadError ? <p className="mt-2 text-sm text-danger" role="alert">{downloadError}</p> : null}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AddressBlock title="Billing address" value={invoice.billing_address} />
          <AddressBlock title="Shipping address" value={invoice.shipping_address} />
        </div>

        {items.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Order items</h3>
            <ul className="mt-4 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                  <img
                    src={item.image_url || comingSoon}
                    alt={item.name || "Product"}
                    className="h-16 w-16 rounded-ui-sm object-cover"
                    onError={(event) => {
                      event.currentTarget.src = comingSoon;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted">{money(item.price)} each</p>
                  </div>
                  <p className="font-semibold">{money((Number(item.price) || 0) * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <dl className="mt-8 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(invoice.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{money(invoice.tax_amount)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{money(invoice.shipping_amount)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-lg font-bold">
            <dt>Total</dt>
            <dd>{money(invoice.total_amount)}</dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-line pt-4 text-sm text-muted">
          <p><span className="font-semibold text-ink">Payment method:</span> {invoice.payment_method || "Not available"}</p>
          <p><span className="font-semibold text-ink">Payment status:</span> {invoice.payment_status || "Not available"}</p>
        </div>

        <div className="mt-8 rounded-ui-sm border border-primary/30 bg-primary/10 p-4">
          <h3 className="font-semibold">Estimated delivery</h3>
          <p className="mt-2 text-sm text-muted">
            Your order will be delivered within 3-5 business days from the date of shipment.
            Tracking details will be sent by email once the order ships.
          </p>
        </div>
        <p className="mt-8 border-t border-line pt-4 text-center text-xs text-muted">
          This ecommerce platform was thoughtfully designed and developed by Thang Truong. Thank you for shopping with us!
        </p>
      </article>
    </div>
  );
}

export default InvoiceDetail;
