import { useState, type FormEvent } from "react";
import { Input, Modal, Select } from "../ui";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";
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
    <Modal open={isOpen && Boolean(childCategory)} title="Edit child category" onClose={close} className="max-w-xl">
      {childCategory ? (
        <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
          <CategorySection title="Parent">
            <p className="font-ui text-sm text-ink">
              Parent: <span className="font-semibold">{childCategory.category_name || "None"}</span>
              {" / "}
              <span className="font-semibold">{childCategory.subcategory_name || "None"}</span>
            </p>
            <Select
              id="child-edit-parent"
              name="subcategory_id"
              label="Subcategory"
              required
              defaultValue={String(childCategory.subcategory_id)}
              options={subcategories.map((subcategory) => ({
                value: String(subcategory.id),
                label: subcategory.category_name ? `${subcategory.category_name} - ${subcategory.name}` : subcategory.name,
              }))}
            />
          </CategorySection>
          <CategorySection title="Details">
            <Input id="child-edit-name" name="name" label="Name" type="text" required defaultValue={childCategory.name} />
            <CategoryTextarea id="child-edit-description" name="description" label="Description" defaultValue={childCategory.description || ""} />
          </CategorySection>
          <CategoryDialogActions onCancel={close} submitLabel="Save" saving={saving} />
        </form>
      ) : null}
    </Modal>
  );
}
