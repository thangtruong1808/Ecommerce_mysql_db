import { useState, type FormEvent } from "react";
import type { Review } from "@shared/engagement";
import { Modal, Select } from "../ui";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";

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
        <CategorySection title="Review">
          <Select id="review-edit-rating" name="rating" label="Rating" defaultValue={String(review.rating)} options={ratings} />
          <CategoryTextarea id="review-edit-comment" name="comment" label="Comment" rows={4} required defaultValue={review.comment} />
        </CategorySection>
        <CategoryDialogActions onCancel={close} submitLabel="Save" saving={saving} />
      </form>
    </Modal>
  );
}
