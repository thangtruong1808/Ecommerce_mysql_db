import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import type { Order } from "@shared/commerce";
import { Badge, Button } from "../ui";
import { focusRing } from "../ui/styles";
import { CategorySelectBox } from "./categoryListChrome";
import StatusBadge, { statusVariant } from "./StatusBadge";
import { formatDate } from "../../utils/dateUtils";
import { isYes, money, orderNumber } from "../../pages/admin/dashboardFormat";

export type AdminOrder = Order & {
  user_email?: string | null;
  item_count?: number;
};

export const ORDER_STATUSES = ["pending", "processing", "paid", "delivered"] as const;

export function orderStatus(order: Pick<AdminOrder, "is_paid" | "is_delivered">): "pending" | "paid" | "delivered" {
  if (isYes(order.is_delivered)) {
    return "delivered";
  }
  if (isYes(order.is_paid)) {
    return "paid";
  }
  return "pending";
}

interface OrderTableRowProps {
  order: AdminOrder;
  rowNumber: number;
  isSelected: boolean;
  statusBusy: boolean;
  onToggle: (id: number | string) => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}

function YesNo({ value }: { value: boolean }) {
  return <Badge variant={value ? "success" : "warning"}>{value ? "Yes" : "No"}</Badge>;
}

export default function OrderTableRow({
  order,
  rowNumber,
  isSelected,
  statusBusy,
  onToggle,
  onStatusChange,
  onDelete,
}: OrderTableRowProps) {
  const label = orderNumber(order);
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select order ${label}`} onClick={() => onToggle(order.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{order.id}</td>
      <td className="whitespace-nowrap px-3 py-3 font-ui text-sm font-semibold">
        <Link to={`/orders/${order.id}`} className={`text-primary hover:text-primary-hover ${focusRing}`}>
          {label}
        </Link>
      </td>
      <td className={cell}>{order.user_id}</td>
      <td className={`${cell} text-ink`}>{order.user_name || "N/A"}</td>
      <td className={cell}>{order.voucher_id || "N/A"}</td>
      <td className={cell}>{money(order.voucher_discount)}</td>
      <td className={cell}>{order.payment_method || "N/A"}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        {order.payment_status ? <Badge variant={statusVariant(order.payment_status)} className="capitalize">{order.payment_status}</Badge> : <span className="font-ui text-muted">N/A</span>}
      </td>
      <td className={cell}>{money(order.tax_price)}</td>
      <td className={cell}>{money(order.shipping_price)}</td>
      <td className="whitespace-nowrap px-3 py-3 font-ui text-sm font-semibold text-ink">{money(order.total_price)}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm"><YesNo value={isYes(order.is_paid)} /></td>
      <td className={cell}>{formatDate(order.paid_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm"><YesNo value={isYes(order.is_delivered)} /></td>
      <td className={cell}>{formatDate(order.delivered_at || "")}</td>
      <td className={cell}>{formatDate(order.created_at || "")}</td>
      <td className={cell}>{formatDate(order.updated_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          <StatusBadge
            currentStatus={orderStatus(order)}
            availableStatuses={[...ORDER_STATUSES]}
            onStatusChange={onStatusChange}
            entityType="order"
            loading={statusBusy}
          />
          <Button variant="danger" size="sm" onClick={onDelete} disabled={statusBusy} aria-label={`Delete order ${label}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
