import { useState, type FormEvent } from "react";
import { Input, Modal, Select } from "../ui";
import CategoryPhotoField from "./CategoryPhotoField";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";
import { readPreview, type ParentOption } from "../../pages/admin/categoryTree";

interface SubcategoryCreateModalProps {
  categories: ParentOption[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category_id: string; name: string; description: string; photo: File | null }) => Promise<void> | void;
}

export default function SubcategoryCreateModal({ categories, isOpen, onClose, onSave }: SubcategoryCreateModalProps) {
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
        category_id: String(formData.get("category_id") || ""),
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
    <Modal open={isOpen} title="Create subcategory" onClose={close} className="max-w-xl">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
        <CategorySection title="Parent">
          <Select
            id="subcategory-create-parent"
            name="category_id"
            label="Category"
            required
            defaultValue=""
            options={[
              { value: "", label: "Select category" },
              ...categories.map((category) => ({ value: String(category.id), label: category.name })),
            ]}
          />
        </CategorySection>
        <CategorySection title="Details">
          <Input id="subcategory-create-name" name="name" label="Name" type="text" required />
          <CategoryTextarea id="subcategory-create-description" name="description" label="Description" />
        </CategorySection>
        <CategorySection title="Photo">
          <CategoryPhotoField
            id="subcategory-create-photo"
            preview={preview}
            previewAlt="New subcategory photo"
            hint="Optional. Upload a photo for this subcategory."
            onFile={(next) => {
              setFile(next);
              readPreview(next, setPreview);
            }}
          />
        </CategorySection>
        <CategoryDialogActions onCancel={close} submitLabel="Create subcategory" saving={saving} />
      </form>
    </Modal>
  );
}
