import { Link } from "react-router-dom";
import { FaEdit, FaEnvelope, FaTrash } from "react-icons/fa";
import type { Invoice } from "@shared/commerce";
import { Badge, Button, type BadgeVariant } from "../ui";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
import { formatDate } from "../../utils/dateUtils";
import { isYes, money } from "../../pages/admin/dashboardFormat";

export type AdminInvoice = Omit<Invoice, "payment_method" | "payment_status"> & {
  user_name?: string | null;
  user_email?: string | null;
  order_number?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
};

interface InvoiceTableRowProps {
  invoice: AdminInvoice;
  rowNumber: number;
  isSelected: boolean;
  emailBusy: boolean;
  locked: boolean;
  onToggle: (id: number | string) => void;
  onResendEmail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function statusVariant(status: string | null | undefined): BadgeVariant {
  if (status === "paid" || status === "succeeded" || status === "completed") {
    return "success";
  }
  if (status === "failed" || status === "canceled") {
    return "danger";
  }
  if (status === "pending" || status === "processing" || !status) {
    return "warning";
  }
  return "neutral";
}

export default function InvoiceTableRow({
  invoice,
  rowNumber,
  isSelected,
  emailBusy,
  locked,
  onToggle,
  onResendEmail,
  onEdit,
  onDelete,
}: InvoiceTableRowProps) {
  const sent = isYes(invoice.email_sent);
  const userLabel = invoice.user_name || invoice.user_email || `User #${invoice.user_id}`;
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={invoice.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{rowNumber}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{invoice.id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline">
          {invoice.invoice_number}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{invoice.order_id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <Link to="/admin/orders" className="text-primary hover:underline">
          {invoice.order_number || `Order #${invoice.order_id}`}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{invoice.user_id}</td>
      <td className="px-6 py-4 text-sm text-muted">{userLabel}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{money(invoice.subtotal)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{money(invoice.tax_amount)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{money(invoice.shipping_amount)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{money(invoice.total_amount)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{invoice.payment_method || "N/A"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <Badge variant={statusVariant(invoice.payment_status)}>{invoice.payment_status || "pending"}</Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <Badge variant={sent ? "success" : "neutral"}>{sent ? "Yes" : "No"}</Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(invoice.email_sent_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(invoice.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            loading={emailBusy}
            disabled={locked && !emailBusy}
            onClick={onResendEmail}
            aria-label={`Resend email for invoice ${invoice.id}`}
          >
            <FaEnvelope className="h-3 w-3" aria-hidden="true" />
            Email
          </Button>
          <Button variant="primary" size="sm" disabled={locked} onClick={onEdit} aria-label={`Edit invoice ${invoice.id}`}>
            <FaEdit className="h-3 w-3" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="danger" size="sm" disabled={locked} onClick={onDelete} aria-label={`Delete invoice ${invoice.id}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
