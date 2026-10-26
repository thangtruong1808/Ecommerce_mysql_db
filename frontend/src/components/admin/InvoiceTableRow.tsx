import { Link } from "react-router-dom";
import { FaEdit, FaEnvelope, FaTrash } from "react-icons/fa";
import type { Invoice } from "@shared/commerce";
import { Badge, Button } from "../ui";
import { focusRing } from "../ui/styles";
import { CategorySelectBox } from "./categoryListChrome";
import { statusVariant } from "./StatusBadge";
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
  const paymentStatus = invoice.payment_status || "pending";
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  const moneyCell = "whitespace-nowrap px-3 py-3 text-right font-ui text-sm tabular-nums text-ink";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select invoice ${invoice.id}`} onClick={() => onToggle(invoice.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{invoice.id}</td>
      <td className="whitespace-nowrap px-3 py-3 font-ui text-sm font-semibold">
        <Link to={`/invoices/${invoice.id}`} className={`text-primary hover:text-primary-hover ${focusRing}`}>
          {invoice.invoice_number}
        </Link>
      </td>
      <td className={cell}>{invoice.order_id}</td>
      <td className="whitespace-nowrap px-3 py-3 font-ui text-sm">
        <Link to="/admin/orders" className={`font-semibold text-primary hover:text-primary-hover ${focusRing}`}>
          {invoice.order_number || `Order #${invoice.order_id}`}
        </Link>
      </td>
      <td className={cell}>{invoice.user_id}</td>
      <td className="px-3 py-3 font-ui text-sm text-muted">{userLabel}</td>
      <td className={moneyCell}>{money(invoice.subtotal)}</td>
      <td className={moneyCell}>{money(invoice.tax_amount)}</td>
      <td className={moneyCell}>{money(invoice.shipping_amount)}</td>
      <td className={`${moneyCell} font-semibold`}>{money(invoice.total_amount)}</td>
      <td className={cell}>{invoice.payment_method || "N/A"}</td>
      <td className="whitespace-nowrap px-3 py-3">
        <Badge variant={statusVariant(paymentStatus)}>{paymentStatus}</Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <Badge variant={sent ? "success" : "neutral"}>{sent ? "Yes" : "No"}</Badge>
      </td>
      <td className={cell}>{formatDate(invoice.email_sent_at || "")}</td>
      <td className={cell}>{formatDate(invoice.created_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
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
