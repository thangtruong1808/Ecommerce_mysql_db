import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import { Button, Modal } from "./ui";
import { useAuth } from "../context/AuthContext";

export interface ProductComment {
  id: number;
  user_id?: number | null;
  user_name?: string | null;
  comment?: string | null;
  created_at?: string | null;
}

export function isProductComment(value: unknown): value is ProductComment {
  if (!value || typeof value !== "object") {
    return false;
  }
  const comment = value as Partial<ProductComment>;
  return typeof comment.id === "number" && typeof comment.comment === "string";
}

function formatStamp(date: string | null | undefined): string {
  const parsed = new Date(date || "");
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

interface CommentItemProps {
  comment: ProductComment;
  onUpdate?: () => void;
  onDelete?: () => void;
}

function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const { user } = useAuth() as { user: { id?: number } | null };
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment || "");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOwner = Boolean(user && comment.user_id != null && user.id === comment.user_id);
  const when = formatStamp(comment.created_at);

  const save = async () => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await axios.put(`/api/comments/${comment.id}`, { comment: editText });
      toast.success("Comment updated successfully!");
      setEditing(false);
      onUpdate?.();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to update comment"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/comments/${comment.id}`);
      toast.success("Comment deleted successfully!");
      setConfirmOpen(false);
      onDelete?.();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to delete comment"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="rounded-ui border border-line bg-surface p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FaUser className="text-muted" aria-hidden="true" />
          <div>
            <p className="font-medium text-ink">{comment.user_name || "Customer"}</p>
            {when ? <time className="text-sm text-muted" dateTime={comment.created_at || undefined}>{when}</time> : null}
          </div>
        </div>
        {isOwner && !editing ? (
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <FaEdit aria-hidden="true" />
              Edit
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
              <FaTrash aria-hidden="true" />
              Delete
            </Button>
          </div>
        ) : null}
      </div>
      {editing ? (
        <div className="space-y-2">
          <label htmlFor={`comment-edit-${comment.id}`} className="sr-only">
            Edit comment
          </label>
          <textarea
            id={`comment-edit-${comment.id}`}
            rows={3}
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            className="w-full rounded-ui-sm border border-line bg-surface px-3 py-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" loading={saving} onClick={() => void save()}>
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={saving}
              onClick={() => {
                setEditing(false);
                setEditText(comment.comment || "");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-ink">{comment.comment}</p>
      )}
      <Modal
        open={confirmOpen}
        title="Delete comment"
        description="This removes your comment from the product."
        onClose={() => {
          if (!deleting) {
            setConfirmOpen(false);
          }
        }}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={deleting} onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={deleting} onClick={() => void remove()}>
            Delete comment
          </Button>
        </div>
      </Modal>
    </article>
  );
}

export default CommentItem;
