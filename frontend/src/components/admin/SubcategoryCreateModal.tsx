import { useState, type FormEvent } from "react";
import { Button, Modal } from "../ui";
import { controlClass } from "../ui/styles";
import CategoryPhotoField from "./CategoryPhotoField";
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
    <Modal open={isOpen} title="Create subcategory" onClose={close}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subcategory-create-parent" className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select id="subcategory-create-parent" name="category_id" required className={controlClass()}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subcategory-create-name" className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input id="subcategory-create-name" name="name" type="text" required className={controlClass()} />
        </div>
        <div>
          <label htmlFor="subcategory-create-description" className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea id="subcategory-create-description" name="description" rows={3} className={controlClass()} />
        </div>
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
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Create subcategory</Button>
        </div>
      </form>
    </Modal>
  );
}
