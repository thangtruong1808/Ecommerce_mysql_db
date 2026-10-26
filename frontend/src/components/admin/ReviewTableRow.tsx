import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Review } from "@shared/engagement";
import StarRating from "../StarRating";
import { Button } from "../ui";
import { focusRing } from "../ui/styles";
import { CategorySelectBox } from "./categoryListChrome";
import { formatDate } from "../../utils/dateUtils";

export type AdminReview = Review & {
  user_email?: string | null;
  product_name?: string | null;
};

interface ReviewTableRowProps {
  review: AdminReview;
  rowNumber: number;
  isSelected: boolean;
  onToggle: (id: number | string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function Stars({ rating }: { rating: number }) {
  const score = Number.isFinite(rating) ? rating : 0;
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={score} readOnly size="sm" />
      <span className="font-ui text-sm text-muted">({score})</span>
    </div>
  );
}

export default function ReviewTableRow({
  review,
  rowNumber,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: ReviewTableRowProps) {
  const productName = review.product_name || `Product #${review.product_id}`;
  const userName = review.user_name || review.user_email || `User #${review.user_id}`;
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select review ${review.id}`} onClick={() => onToggle(review.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{review.id}</td>
      <td className="px-3 py-3 font-ui text-sm">
        <Link to={`/products/${review.product_id}`} className={`font-semibold text-primary hover:text-primary-hover ${focusRing}`}>
          {productName}
        </Link>
      </td>
      <td className={cell}>{review.product_id}</td>
      <td className="px-3 py-3 font-ui text-sm text-muted">{userName}</td>
      <td className={cell}>{review.user_id}</td>
      <td className="whitespace-nowrap px-3 py-3"><Stars rating={review.rating} /></td>
      <td className="max-w-xs truncate px-3 py-3 font-ui text-sm text-muted" title={review.comment}>{review.comment}</td>
      <td className={cell}>{formatDate(review.created_at || "")}</td>
      <td className={cell}>{formatDate(review.updated_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={onEdit} aria-label={`Edit review ${review.id}`}>
            <FaEdit className="h-3 w-3" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete} aria-label={`Delete review ${review.id}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
