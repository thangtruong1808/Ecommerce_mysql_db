import { useState, type FormEvent } from "react";
import { Button, Modal } from "../ui";
import { controlClass } from "../ui/styles";
import CategoryPhotoField from "./CategoryPhotoField";
import { readPreview } from "../../pages/admin/categoryTree";

interface CategoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; photo: File | null }) => Promise<void> | void;
}

export default function CategoryCreateModal({ isOpen, onClose, onSave }: CategoryCreateModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      setPreview(null);
      setFile(null);
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await onSave({
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        photo: file,
      });
      setPreview(null);
      setFile(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen} title="Create category" onClose={close}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category-create-name" className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input id="category-create-name" name="name" type="text" required className={controlClass()} />
        </div>
        <div>
          <label htmlFor="category-create-description" className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea id="category-create-description" name="description" rows={3} className={controlClass()} />
        </div>
        <CategoryPhotoField
          id="category-create-photo"
          preview={preview}
          previewAlt="New category photo"
          hint="Optional. Upload a photo for this category."
          onFile={(next) => {
            setFile(next);
            readPreview(next, setPreview);
          }}
        />
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Create category</Button>
        </div>
      </form>
    </Modal>
  );
}
