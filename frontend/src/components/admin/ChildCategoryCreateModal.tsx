import { useState, type FormEvent } from "react";
import { Input, Modal, Select } from "../ui";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";
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
    <Modal open={isOpen} title="Create child category" onClose={close} className="max-w-xl">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
        <CategorySection title="Parent">
          <Select
            id="child-create-parent"
            name="subcategory_id"
            label="Subcategory"
            required
            defaultValue=""
            options={[
              { value: "", label: "Select subcategory" },
              ...subcategories.map((subcategory) => ({
                value: String(subcategory.id),
                label: subcategory.category_name ? `${subcategory.category_name} - ${subcategory.name}` : subcategory.name,
              })),
            ]}
          />
        </CategorySection>
        <CategorySection title="Details">
          <Input id="child-create-name" name="name" label="Name" type="text" required />
          <CategoryTextarea id="child-create-description" name="description" label="Description" />
        </CategorySection>
        <CategoryDialogActions onCancel={close} submitLabel="Create child category" saving={saving} />
      </form>
    </Modal>
  );
}
