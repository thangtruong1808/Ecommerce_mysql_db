import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { FaComment } from "react-icons/fa";
import { Button } from "./ui";
import { useAuth } from "../context/AuthContext";

interface CommentFormProps {
  productId: number;
  onCommentSubmitted?: () => void;
}

interface CommentFields {
  comment: string;
}

const EMOJIS = ["😀", "😃", "😄", "😁", "😊", "😍", "🤔", "👍", "❤️", "🎉", "🔥", "💯"];

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

function CommentForm({ productId, onCommentSubmitted }: CommentFormProps) {
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CommentFields>({ defaultValues: { comment: "" } });
  const watchedComment = watch("comment");

  const insertEmoji = (emoji: string) => {
    setValue("comment", `${watchedComment || ""}${emoji}`, { shouldValidate: true });
  };

  const onSubmit = async (data: CommentFields) => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a comment");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/products/${productId}/comments`, { comment: data.comment });
      toast.success("Comment submitted successfully!");
      reset();
      onCommentSubmitted?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session expired. Please try again.");
      } else {
        toast.error(messageFrom(error, "Failed to submit comment"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="rounded-ui-lg border border-line bg-surface px-4 py-4 text-center text-sm text-muted shadow-ui">
        Please login to write a comment
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-ui-lg border border-line bg-surface p-5 shadow-ui sm:p-6" noValidate>
      <h3 className="font-ui text-lg font-semibold text-ink">Write a comment</h3>
      <div>
        <label htmlFor="product-comment" className="mb-2 block text-sm font-medium text-ink">
          Your comment
        </label>
        <textarea
          id="product-comment"
          rows={4}
          className="w-full rounded-ui border border-line bg-canvas px-3 py-2 text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Write your comment here..."
          {...register("comment", { required: "Comment is required" })}
        />
        {errors.comment ? <p className="mt-1 text-sm text-danger">{errors.comment.message}</p> : null}
        <div className="mt-2 flex flex-wrap gap-1" aria-label="Insert an emoji">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="rounded-ui-sm px-1 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:scale-110"
              aria-label={`Insert ${emoji}`}
              onClick={() => insertEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" loading={loading}>
        <FaComment aria-hidden="true" />
        Submit comment
      </Button>
    </form>
  );
}

export default CommentForm;
