import { useState, type FormEvent } from "react";
import { Input, Modal } from "../ui";
import CategoryPhotoField from "./CategoryPhotoField";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";
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
    <Modal open={isOpen} title="Create category" onClose={close} className="max-w-xl">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
        <CategorySection title="Details">
          <Input id="category-create-name" name="name" label="Name" type="text" required />
          <CategoryTextarea id="category-create-description" name="description" label="Description" />
        </CategorySection>
        <CategorySection title="Photo">
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
        </CategorySection>
        <CategoryDialogActions onCancel={close} submitLabel="Create category" saving={saving} />
      </form>
    </Modal>
  );
}
