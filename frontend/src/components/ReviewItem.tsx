import StarRating from "./StarRating";

export interface ProductReview {
  id: number;
  user_name?: string | null;
  rating?: number | string | null;
  comment?: string | null;
  created_at?: string | null;
}

export function isProductReview(value: unknown): value is ProductReview {
  if (!value || typeof value !== "object") {
    return false;
  }
  return typeof (value as { id?: unknown }).id === "number";
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

function ReviewItem({ review }: { review: ProductReview }) {
  const rating = Number.parseFloat(String(review.rating ?? "")) || 0;
  const when = formatStamp(review.created_at);

  return (
    <article className="rounded-ui-lg border border-line bg-canvas p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{review.user_name || "Customer"}</p>
          <StarRating rating={rating} readOnly size="sm" />
        </div>
        {when ? <time className="text-sm text-muted" dateTime={review.created_at || undefined}>{when}</time> : null}
      </div>
      {review.comment ? <p className="text-ink">{review.comment}</p> : null}
    </article>
  );
}

export default ReviewItem;
