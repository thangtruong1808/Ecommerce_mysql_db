import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import type { Comment } from "@shared/engagement";
import { Badge, Button } from "../ui";
import { CategorySelectBox } from "./categoryListChrome";
import { formatDate } from "../../utils/dateUtils";
import { isYes } from "../../pages/admin/dashboardFormat";

export type AdminComment = Comment & {
  product_name?: string | null;
  user_email?: string | null;
};

interface CommentTableRowProps {
  comment: AdminComment;
  rowNumber: number;
  isSelected: boolean;
  busy: boolean;
  onToggle: (id: number | string) => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

export default function CommentTableRow({
  comment,
  rowNumber,
  isSelected,
  busy,
  onToggle,
  onApprove,
  onReject,
  onDelete,
}: CommentTableRowProps) {
  const approved = isYes(comment.is_approved);
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select comment ${comment.id}`} onClick={() => onToggle(comment.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{comment.id}</td>
      <td className="px-3 py-3 font-ui text-sm font-semibold text-ink">{comment.product_name || `Product #${comment.product_id}`}</td>
      <td className="px-3 py-3 font-ui text-sm">
        <div className="font-semibold text-ink">{comment.user_name || `User #${comment.user_id}`}</div>
        {comment.user_email ? <div className="text-xs text-muted">{comment.user_email}</div> : null}
      </td>
      <td className="max-w-xs px-3 py-3 font-ui text-sm text-muted">
        <p className="line-clamp-2" title={comment.comment}>{comment.comment}</p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <Badge variant={approved ? "success" : "warning"}>{approved ? "Approved" : "Pending"}</Badge>
      </td>
      <td className={cell}>{formatDate(comment.created_at || "")}</td>
      <td className={cell}>{formatDate(comment.updated_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          {approved ? (
            <Button variant="secondary" size="sm" loading={busy} onClick={onReject} aria-label={`Reject comment ${comment.id}`}>
              <FaTimes className="h-3 w-3" aria-hidden="true" />
              Reject
            </Button>
          ) : (
            <Button variant="primary" size="sm" loading={busy} onClick={onApprove} aria-label={`Approve comment ${comment.id}`}>
              <FaCheck className="h-3 w-3" aria-hidden="true" />
              Approve
            </Button>
          )}
          <Button variant="danger" size="sm" disabled={busy} onClick={onDelete} aria-label={`Delete comment ${comment.id}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
