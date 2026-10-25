interface StarRatingProps {
  rating?: number;
  readOnly?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md";
}

const sizes = {
  sm: "text-sm leading-none",
  md: "text-2xl leading-none",
};

function StarRating({ rating = 0, readOnly = false, onChange, size = "md" }: StarRatingProps) {
  const value = Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  const starClass = sizes[size];
  const tone = (star: number) => (star <= value ? "text-secondary" : "text-line");

  if (readOnly) {
    const label = value > 0 ? `Rated ${Number(value.toFixed(1))} out of 5` : "No rating yet";
    return (
      <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} aria-hidden="true" className={`${starClass} ${tone(star)}`}>
            ★
          </span>
        ))}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label="Rating" className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
          className={`${starClass} rounded-ui-sm px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${tone(star)} hover:text-secondary`}
          onClick={() => onChange?.(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
