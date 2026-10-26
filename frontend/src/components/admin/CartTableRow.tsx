import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import type { Cart } from "@shared/commerce";
import { Badge, Button } from "../ui";
import { focusRing } from "../ui/styles";
import { CategorySelectBox } from "./categoryListChrome";
import { formatDate } from "../../utils/dateUtils";
import { money } from "../../pages/admin/dashboardFormat";

export interface AdminCartItem {
  id: number;
  product_id?: number;
  product_name?: string | null;
  quantity?: number | string | null;
  price?: number | string | null;
}

export type AdminCart = Omit<Cart, "items"> & {
  user_name?: string | null;
  user_email?: string | null;
  item_count?: number | string | null;
  total_value?: number | string | null;
  items?: AdminCartItem[];
};

interface CartTableRowProps {
  cart: AdminCart;
  rowNumber: number;
  isSelected: boolean;
  viewBusy: boolean;
  locked: boolean;
  onToggle: (id: number | string) => void;
  onView: () => void;
  onDelete: () => void;
}

export default function CartTableRow({
  cart,
  rowNumber,
  isSelected,
  viewBusy,
  locked,
  onToggle,
  onView,
  onDelete,
}: CartTableRowProps) {
  const guest = !cart.user_id;
  const userLabel = cart.user_name || cart.user_email || `User #${cart.user_id}`;
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select cart ${cart.id}`} onClick={() => onToggle(cart.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{cart.id}</td>
      <td className="whitespace-nowrap px-3 py-3">
        {guest ? <Badge variant="neutral">Guest</Badge> : <span className="font-ui text-sm text-ink">{cart.user_id}</span>}
      </td>
      <td className="px-3 py-3 font-ui text-sm">
        {guest ? (
          <Badge variant="neutral">Guest</Badge>
        ) : (
          <Link to="/admin/users" className={`font-semibold text-primary hover:text-primary-hover ${focusRing}`}>
            {userLabel}
          </Link>
        )}
      </td>
      <td className={`${cell} text-ink`}>{Number(cart.item_count) || 0}</td>
      <td className="whitespace-nowrap px-3 py-3 text-right font-ui text-sm font-semibold tabular-nums text-ink">{money(cart.total_value)}</td>
      <td className={cell}>{formatDate(cart.created_at || "")}</td>
      <td className={cell}>{formatDate(cart.updated_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            loading={viewBusy}
            disabled={locked && !viewBusy}
            onClick={onView}
            aria-label={`View cart ${cart.id}`}
          >
            <FaEye className="h-3 w-3" aria-hidden="true" />
            View
          </Button>
          <Button variant="danger" size="sm" disabled={locked} onClick={onDelete} aria-label={`Delete cart ${cart.id}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
