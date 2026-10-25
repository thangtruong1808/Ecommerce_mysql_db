import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Skeleton } from "./ui";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted?: () => void;
}

interface ReviewFields {
  comment: string;
}

const notice = "rounded-ui border border-line bg-surface-muted px-4 py-4 text-center text-sm text-muted";

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { isAuthenticated, user } = useAuth() as {
    isAuthenticated: boolean;
    user: { id?: number } | null;
  };
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [checking, setChecking] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFields>();

  const checkStatus = useCallback(async () => {
    if (!isAuthenticated || !user || !productId) {
      setChecking(false);
      setStatusError(null);
      return;
    }
    setChecking(true);
    setStatusError(null);
    try {
      const [mine, eligibility] = await Promise.all([
        axios.get(`/api/products/${productId}/reviews/my`),
        axios.get(`/api/products/${productId}/reviews/eligibility`),
      ]);
      setHasReviewed(Boolean(mine.data));
      setIsEligible(Boolean(eligibility.data?.eligible));
    } catch (error) {
      setStatusError(messageFrom(error, "Review eligibility could not be checked."));
    } finally {
      setChecking(false);
    }
  }, [isAuthenticated, productId, user]);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus]);

  const onSubmit = async (data: ReviewFields) => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }
    if (rating === 0) {
      setRatingError("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment: data.comment,
      });
      toast.success("Review submitted successfully!");
      setHasReviewed(true);
      reset();
      setRating(0);
      setRatingError(null);
      onReviewSubmitted?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session expired. Please try again.");
      } else {
        toast.error(messageFrom(error, "Failed to submit review"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <p className={notice}>Please login to write a review</p>;
  }

  if (checking) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16" />
        <p className="sr-only">Checking review eligibility</p>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className={`${notice} space-y-3`}>
        <p>{statusError}</p>
        <Button type="button" size="sm" onClick={() => void checkStatus()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className={notice}>
        <p className="mb-1 font-semibold text-ink">Review this product</p>
        <p>
          To write a review, you must have purchased this product. Once you have made a purchase, you can share your
          experience here.
        </p>
      </div>
    );
  }

  if (hasReviewed) {
    return <p className={notice}>You have already submitted a review for this product.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-ui border border-line bg-surface p-6" noValidate>
      <h3 className="text-lg font-semibold text-ink">Write a review</h3>
      <div>
        <p id="review-rating-label" className="mb-2 block text-sm font-medium text-ink">
          Rating
        </p>
        <div aria-labelledby="review-rating-label">
          <StarRating
            rating={rating}
            onChange={(next) => {
              setRating(next);
              setRatingError(null);
            }}
          />
        </div>
        {ratingError ? <p className="mt-1 text-sm text-danger">{ratingError}</p> : null}
      </div>
      <div>
        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-ink">
          Your review
        </label>
        <textarea
          id="review-comment"
          rows={4}
          className="w-full rounded-ui-sm border border-line bg-surface px-3 py-2 text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Write your review here..."
          {...register("comment", { required: "Review comment is required" })}
        />
        {errors.comment ? <p className="mt-1 text-sm text-danger">{errors.comment.message}</p> : null}
      </div>
      <Button type="submit" loading={loading}>
        Submit review
      </Button>
    </form>
  );
}

export default ReviewForm;
