import { useState, type FormEvent } from "react";
import type { Review } from "@shared/engagement";
import { Button, Modal, Select } from "../ui";
import { controlClass } from "../ui/styles";

export interface ReviewEditInput {
  rating: number;
  comment: string;
}

interface ReviewEditModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReviewEditInput) => Promise<void>;
}

const ratings = [
  { value: "1", label: "1 star" },
  { value: "2", label: "2 stars" },
  { value: "3", label: "3 stars" },
  { value: "4", label: "4 stars" },
  { value: "5", label: "5 stars" },
];

export default function ReviewEditModal({ review, isOpen, onClose, onSave }: ReviewEditModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!review || saving) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const rating = Number(formData.get("rating"));
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return;
    }
    setSaving(true);
    try {
      await onSave({
        rating,
        comment: String(formData.get("comment") || ""),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!review) {
    return null;
  }

  return (
    <Modal open={isOpen} title="Edit review" onClose={close}>
      <form key={review.id} onSubmit={handleSubmit} className="space-y-4">
        <Select id="review-edit-rating" name="rating" label="Rating" defaultValue={String(review.rating)} options={ratings} />
        <div>
          <label htmlFor="review-edit-comment" className="mb-1 block text-sm font-medium text-ink">Comment</label>
          <textarea id="review-edit-comment" name="comment" rows={4} required defaultValue={review.comment} className={controlClass()} />
        </div>
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}
