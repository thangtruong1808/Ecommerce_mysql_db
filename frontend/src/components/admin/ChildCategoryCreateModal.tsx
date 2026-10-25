import { useState, type FormEvent } from "react";
import { Button, Modal } from "../ui";
import { controlClass } from "../ui/styles";
import type { ParentOption } from "../../pages/admin/categoryTree";

interface ChildCategoryCreateModalProps {
  subcategories: ParentOption[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { subcategory_id: string; name: string; description: string }) => Promise<void> | void;
}

export default function ChildCategoryCreateModal({ subcategories, isOpen, onClose, onSave }: ChildCategoryCreateModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
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
        subcategory_id: String(formData.get("subcategory_id") || ""),
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen} title="Create child category" onClose={close}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="child-create-parent" className="mb-1 block text-sm font-medium text-ink">Subcategory</label>
          <select id="child-create-parent" name="subcategory_id" required className={controlClass()}>
            <option value="">Select subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.category_name ? `${subcategory.category_name} - ${subcategory.name}` : subcategory.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="child-create-name" className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input id="child-create-name" name="name" type="text" required className={controlClass()} />
        </div>
        <div>
          <label htmlFor="child-create-description" className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea id="child-create-description" name="description" rows={3} className={controlClass()} />
        </div>
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Create child category</Button>
        </div>
      </form>
    </Modal>
  );
}
