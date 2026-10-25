import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import type { Order } from "@shared/commerce";
import { Badge, Button } from "../ui";
import { focusRing } from "../ui/styles";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
import StatusBadge from "./StatusBadge";
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
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={order.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{rowNumber}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{order.id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <Link to={`/orders/${order.id}`} className={`text-primary hover:text-primary-hover ${focusRing}`}>
          {label}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{order.user_id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{order.user_name || "N/A"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{order.voucher_id || "N/A"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{money(order.voucher_discount)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{order.payment_method || "N/A"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{order.payment_status || "N/A"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{money(order.tax_price)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{money(order.shipping_price)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{money(order.total_price)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm"><YesNo value={isYes(order.is_paid)} /></td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(order.paid_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm"><YesNo value={isYes(order.is_delivered)} /></td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(order.delivered_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(order.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(order.updated_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
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
