import { useState, type FormEvent } from "react";
import { Button, Modal } from "../ui";
import { controlClass } from "../ui/styles";
import type { ChildCategoryRecord, ParentOption } from "../../pages/admin/categoryTree";

interface ChildCategoryEditModalProps {
  childCategory: ChildCategoryRecord | null;
  subcategories: ParentOption[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { subcategory_id: string; name: string; description: string }) => Promise<void> | void;
}

export default function ChildCategoryEditModal({
  childCategory,
  subcategories,
  isOpen,
  onClose,
  onSave,
}: ChildCategoryEditModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!childCategory || saving) {
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
    <Modal open={isOpen && Boolean(childCategory)} title="Edit child category" onClose={close}>
      {childCategory ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="child-edit-parent" className="mb-1 block text-sm font-medium text-ink">Subcategory</label>
            <select id="child-edit-parent" name="subcategory_id" required defaultValue={childCategory.subcategory_id} className={controlClass()}>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.category_name ? `${subcategory.category_name} - ${subcategory.name}` : subcategory.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="child-edit-name" className="mb-1 block text-sm font-medium text-ink">Name</label>
            <input id="child-edit-name" name="name" type="text" required defaultValue={childCategory.name} className={controlClass()} />
          </div>
          <div>
            <label htmlFor="child-edit-description" className="mb-1 block text-sm font-medium text-ink">Description</label>
            <textarea id="child-edit-description" name="description" rows={3} defaultValue={childCategory.description || ""} className={controlClass()} />
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
