import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input, Modal, Select } from "../ui";
import CategoryPhotoField from "./CategoryPhotoField";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";
import { messageFrom } from "../../pages/admin/dashboardFormat";
import { photoSrc, readPreview, type ParentOption, type SubcategoryRecord } from "../../pages/admin/categoryTree";

interface SubcategoryEditModalProps {
  subcategory: SubcategoryRecord | null;
  categories: ParentOption[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category_id: string; name: string; description: string }) => Promise<void> | void;
}

export default function SubcategoryEditModal({
  subcategory,
  categories,
  isOpen,
  onClose,
  onSave,
}: SubcategoryEditModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const busy = saving || deletingPhoto;

  useEffect(() => {
    if (!isOpen || !subcategory) {
      return;
    }
    setPreview(subcategory.photo_url ? photoSrc(subcategory.photo_url) : null);
    setFile(null);
  }, [subcategory, isOpen]);

  const close = () => {
    if (!busy) {
      onClose();
    }
  };

  const handleDeletePhoto = async () => {
    if (!subcategory?.photo_url || deletingPhoto) {
      return;
    }
    setDeletingPhoto(true);
    try {
      await axios.delete(`/api/admin/subcategories/${subcategory.id}/photo`);
      toast.success("Photo deleted successfully");
      setPreview(null);
      setFile(null);
      await onSave({
        category_id: String(subcategory.category_id),
        name: subcategory.name,
        description: subcategory.description || "",
      });
    } catch (error: unknown) {
      toast.error(messageFrom(error, "Failed to delete photo"));
    } finally {
      setDeletingPhoto(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subcategory || busy) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const updateData = {
      category_id: String(formData.get("category_id") || ""),
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
    };
    setSaving(true);
    try {
      if (file) {
        const photoFormData = new FormData();
        photoFormData.append("photo", file);
        await axios.post(`/api/admin/subcategories/${subcategory.id}/photo`, photoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Photo uploaded successfully");
      }
      await onSave(updateData);
    } catch (error: unknown) {
      toast.error(messageFrom(error, "Failed to save subcategory"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen && Boolean(subcategory)} title="Edit subcategory" onClose={close} className="max-w-xl">
      {subcategory ? (
        <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
          <CategorySection title="Parent">
            <p className="font-ui text-sm text-ink">
              Parent category: <span className="font-semibold">{subcategory.category_name || "None"}</span>
            </p>
            <Select
              id="subcategory-edit-parent"
              name="category_id"
              label="Category"
              required
              defaultValue={String(subcategory.category_id)}
              options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
            />
          </CategorySection>
          <CategorySection title="Details">
            <Input id="subcategory-edit-name" name="name" label="Name" type="text" required defaultValue={subcategory.name} />
            <CategoryTextarea id="subcategory-edit-description" name="description" label="Description" defaultValue={subcategory.description || ""} />
          </CategorySection>
          <CategorySection title="Photo">
            <CategoryPhotoField
              id="subcategory-edit-photo"
              preview={preview}
              previewAlt={`${subcategory.name} photo`}
              hint="Upload a new photo to replace the current one."
              deleting={deletingPhoto}
              canDelete={Boolean(subcategory.photo_url) && !file}
              onDelete={handleDeletePhoto}
              onFile={(next) => {
                setFile(next);
                readPreview(next, setPreview);
              }}
            />
          </CategorySection>
          <CategoryDialogActions onCancel={close} submitLabel="Save" saving={saving} disabled={deletingPhoto} />
        </form>
      ) : null}
    </Modal>
  );
}
