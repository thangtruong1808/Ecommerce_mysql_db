import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import type { Cart } from "@shared/commerce";
import { Button } from "../ui";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
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
  const userLabel = cart.user_name || cart.user_email || `User #${cart.user_id}`;
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={cart.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{rowNumber}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{cart.id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
        {cart.user_id || <span>Guest</span>}
      </td>
      <td className="px-6 py-4 text-sm">
        {cart.user_id ? (
          <Link to="/admin/users" className="text-primary hover:underline">
            {userLabel}
          </Link>
        ) : (
          <span className="text-muted">Guest</span>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{Number(cart.item_count) || 0}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{money(cart.total_value)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(cart.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(cart.updated_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
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
