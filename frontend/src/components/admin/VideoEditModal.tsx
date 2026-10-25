import { useState, type FormEvent } from "react";
import { Button, Modal } from "../ui";
import { controlClass } from "../ui/styles";
import { durationValue } from "../../pages/admin/mediaFormat";
import type { ProductVideo } from "@shared/catalog";

export interface VideoEditInput {
  title: string;
  description: string;
  thumbnail_url: string;
  duration: number | null;
}

interface VideoEditModalProps {
  video: ProductVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VideoEditInput) => Promise<void> | void;
}

export default function VideoEditModal({ video, isOpen, onClose, onSave }: VideoEditModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!video || saving) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await onSave({
        title: String(formData.get("title") || ""),
        description: String(formData.get("description") || ""),
        thumbnail_url: String(formData.get("thumbnail_url") || ""),
        duration: durationValue(formData.get("duration")),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen && Boolean(video)} title="Edit video" onClose={close}>
      {video ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="video-edit-title" className="mb-1 block text-sm font-medium text-ink">Title</label>
            <input id="video-edit-title" name="title" type="text" defaultValue={video.title || ""} className={controlClass()} />
          </div>
          <div>
            <label htmlFor="video-edit-description" className="mb-1 block text-sm font-medium text-ink">Description</label>
            <textarea id="video-edit-description" name="description" rows={3} defaultValue={video.description || ""} className={controlClass()} />
          </div>
          <div>
            <label htmlFor="video-edit-thumbnail" className="mb-1 block text-sm font-medium text-ink">Thumbnail URL</label>
            <input id="video-edit-thumbnail" name="thumbnail_url" type="text" defaultValue={video.thumbnail_url || ""} className={controlClass()} />
          </div>
          <div>
            <label htmlFor="video-edit-duration" className="mb-1 block text-sm font-medium text-ink">Duration (seconds)</label>
            <input id="video-edit-duration" name="duration" type="number" min="0" defaultValue={video.duration ?? ""} className={controlClass()} />
          </div>
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
