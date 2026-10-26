import { Link } from "react-router-dom";
import { FaTrash, FaUser, FaUserSlash } from "react-icons/fa";
import { Badge, Button } from "../ui";
import { focusRing } from "../ui/styles";
import { CategorySelectBox } from "./categoryListChrome";
import { formatDate } from "../../utils/dateUtils";

export interface AdminProductView {
  id: number;
  product_id: number;
  user_id?: number | null;
  session_id?: string | null;
  viewed_at?: string | null;
  product_name?: string | null;
  product_image?: string | null;
  user_name?: string | null;
  user_email?: string | null;
}

interface ProductViewTableRowProps {
  view: AdminProductView;
  rowNumber: number;
  isSelected: boolean;
  locked: boolean;
  onToggle: (id: number | string) => void;
  onDelete: () => void;
}

export default function ProductViewTableRow({
  view,
  rowNumber,
  isSelected,
  locked,
  onToggle,
  onDelete,
}: ProductViewTableRowProps) {
  const authenticated = Boolean(view.user_id);
  const sessionLabel = view.session_id ? `${view.session_id.slice(0, 8)}...` : "Guest";
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select product view ${view.id}`} onClick={() => onToggle(view.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{view.id}</td>
      <td className="px-3 py-3">
        <Link to={`/products/${view.product_id}`} className={`flex items-center gap-2 font-ui text-sm font-medium text-ink hover:text-primary ${focusRing}`}>
          {view.product_image ? (
            <img src={view.product_image} alt="" className="h-10 w-10 shrink-0 rounded-ui object-cover" loading="lazy" decoding="async" />
          ) : null}
          <span>{view.product_name || `Product #${view.product_id}`}</span>
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {authenticated ? (
          <Badge variant="primary">
            <FaUser className="mr-1 shrink-0" aria-hidden="true" />
            Authenticated
          </Badge>
        ) : (
          <Badge variant="neutral">
            <FaUserSlash className="mr-1 shrink-0" aria-hidden="true" />
            Guest
          </Badge>
        )}
      </td>
      <td className={cell}>
        {authenticated ? (
          <div>
            <div className="font-medium text-ink">{view.user_name || "Unknown"}</div>
            {view.user_email ? <div className="text-xs">{view.user_email}</div> : null}
          </div>
        ) : (
          <div className="font-ui text-xs">{sessionLabel}</div>
        )}
      </td>
      <td className={cell}>{formatDate(view.viewed_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        <Button variant="danger" size="sm" disabled={locked} onClick={onDelete} aria-label={`Delete product view ${view.id}`}>
          <FaTrash className="h-3 w-3" aria-hidden="true" />
          Delete
        </Button>
      </td>
    </tr>
  );
}
