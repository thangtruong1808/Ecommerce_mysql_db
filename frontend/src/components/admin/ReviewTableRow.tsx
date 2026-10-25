import { Link } from "react-router-dom";
import { FaEdit, FaStar, FaTrash } from "react-icons/fa";
import type { Review } from "@shared/engagement";
import { Button } from "../ui";
import { focusRing } from "../ui/styles";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
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
    <div className="flex items-center gap-1" aria-label={`Rating ${score} of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className={star <= score ? "text-secondary" : "text-muted"} aria-hidden="true" />
      ))}
      <span className="ml-1 text-sm text-muted">({score})</span>
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
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={review.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{rowNumber}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{review.id}</td>
      <td className="px-6 py-4 text-sm">
        <Link to={`/products/${review.product_id}`} className={`text-primary hover:text-primary-hover ${focusRing}`}>
          {productName}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{review.product_id}</td>
      <td className="px-6 py-4 text-sm text-muted">{userName}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{review.user_id}</td>
      <td className="whitespace-nowrap px-6 py-4"><Stars rating={review.rating} /></td>
      <td className="max-w-xs truncate px-6 py-4 text-sm text-muted" title={review.comment}>{review.comment}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(review.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(review.updated_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
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
