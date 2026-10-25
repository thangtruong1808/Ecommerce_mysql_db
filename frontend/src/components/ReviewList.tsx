import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Button, EmptyState, Skeleton } from "./ui";
import ReviewItem, { isProductReview, type ProductReview } from "./ReviewItem";

interface RefetchHandle {
  current: (() => void) | null;
}

interface ReviewListProps {
  productId: number;
  onRefetch?: RefetchHandle;
}

function messageFrom(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || "Reviews could not be loaded.";
  }
  return "Reviews could not be loaded.";
}

function ReviewList({ productId, onRefetch }: ReviewListProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setLoadError(null);
    try {
      const response = await axios.get(`/api/products/${productId}/reviews`, {
        params: { page: nextPage, limit: 10 },
      });
      const list = Array.isArray(response.data?.reviews)
        ? response.data.reviews.filter(isProductReview)
        : [];
      setReviews((current) => (append ? [...current, ...list] : list));
      setPage(Number(response.data?.pagination?.page) || nextPage);
      setPages(Number(response.data?.pagination?.pages) || 1);
    } catch (error) {
      if (!append) {
        setReviews([]);
      }
      setLoadError(messageFrom(error));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [productId]);

  useEffect(() => {
    void load(1, false);
  }, [load]);

  useEffect(() => {
    if (!onRefetch) {
      return undefined;
    }
    onRefetch.current = () => {
      void load(1, false);
    };
    return () => {
      onRefetch.current = null;
    };
  }, [load, onRefetch]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <p className="sr-only">Loading reviews</p>
      </div>
    );
  }

  if (loadError && reviews.length === 0) {
    return (
      <EmptyState
        title="Reviews could not be loaded"
        description={loadError}
        action={
          <Button type="button" onClick={() => void load(1, false)}>
            Try again
          </Button>
        }
      />
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-muted">No reviews yet. Be the first to review this product!</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      {loadError ? <p className="text-sm text-danger">{loadError}</p> : null}
      {page < pages ? (
        <Button type="button" variant="outline" loading={loadingMore} onClick={() => void load(page + 1, true)}>
          Show more reviews
        </Button>
      ) : null}
    </div>
  );
}

export default ReviewList;
