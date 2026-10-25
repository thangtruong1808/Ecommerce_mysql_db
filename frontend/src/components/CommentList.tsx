import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaComments } from "react-icons/fa";
import { Button, EmptyState, Skeleton } from "./ui";
import CommentItem, { isProductComment, type ProductComment } from "./CommentItem";

interface RefetchHandle {
  current: (() => void) | null;
}

interface CommentListProps {
  productId: number;
  onRefetch?: RefetchHandle;
}

function messageFrom(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || "Comments could not be loaded.";
  }
  return "Comments could not be loaded.";
}

function CommentList({ productId, onRefetch }: CommentListProps) {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await axios.get(`/api/products/${productId}/comments`);
      const list = Array.isArray(response.data) ? response.data.filter(isProductComment) : null;
      if (!list) {
        setComments([]);
        setLoadError("Comments could not be loaded.");
        return;
      }
      setComments(list);
    } catch (error) {
      setComments([]);
      setLoadError(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!onRefetch) {
      return undefined;
    }
    onRefetch.current = () => {
      void load();
    };
    return () => {
      onRefetch.current = null;
    };
  }, [load, onRefetch]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <p className="sr-only">Loading comments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <FaComments className="text-muted" aria-hidden="true" />
        Comments ({comments.length})
      </h3>
      {loadError ? (
        <EmptyState
          title="Comments could not be loaded"
          description={loadError}
          action={
            <Button type="button" onClick={() => void load()}>
              Try again
            </Button>
          }
        />
      ) : null}
      {!loadError && comments.length === 0 ? (
        <p className="rounded-ui border border-dashed border-line bg-surface-muted px-4 py-6 text-center text-sm text-muted">
          No comments yet. Be the first to comment!
        </p>
      ) : null}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onUpdate={() => void load()} onDelete={() => void load()} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default CommentList;
