import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input, Modal } from "../ui";
import CategoryPhotoField from "./CategoryPhotoField";
import { CategoryDialogActions, CategorySection, CategoryTextarea } from "./categoryDialogChrome";
import { messageFrom } from "../../pages/admin/dashboardFormat";
import { photoSrc, readPreview, type CategoryRecord } from "../../pages/admin/categoryTree";

interface CategoryEditModalProps {
  category: CategoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void> | void;
}

export default function CategoryEditModal({ category, isOpen, onClose, onSave }: CategoryEditModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const busy = saving || deletingPhoto;

  useEffect(() => {
    if (!isOpen || !category) {
      return;
    }
    setPreview(category.photo_url ? photoSrc(category.photo_url) : null);
    setFile(null);
  }, [category, isOpen]);

  const close = () => {
    if (!busy) {
      onClose();
    }
  };

  const handleDeletePhoto = async () => {
    if (!category?.photo_url || deletingPhoto) {
      return;
    }
    setDeletingPhoto(true);
    try {
      await axios.delete(`/api/admin/categories/${category.id}/photo`);
      toast.success("Photo deleted successfully");
      setPreview(null);
      setFile(null);
      await onSave({ name: category.name, description: category.description || "" });
    } catch (error: unknown) {
      toast.error(messageFrom(error, "Failed to delete photo"));
    } finally {
      setDeletingPhoto(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category || busy) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const updateData = {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
    };
    setSaving(true);
    try {
      if (file) {
        const photoFormData = new FormData();
        photoFormData.append("photo", file);
        await axios.post(`/api/admin/categories/${category.id}/photo`, photoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Photo uploaded successfully");
      }
      await onSave(updateData);
    } catch (error: unknown) {
      toast.error(messageFrom(error, "Failed to save category"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen && Boolean(category)} title="Edit category" onClose={close} className="max-w-xl">
      {category ? (
        <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
          <CategorySection title="Details">
            <Input id="category-edit-name" name="name" label="Name" type="text" required defaultValue={category.name} />
            <CategoryTextarea id="category-edit-description" name="description" label="Description" defaultValue={category.description || ""} />
          </CategorySection>
          <CategorySection title="Photo">
            <CategoryPhotoField
              id="category-edit-photo"
              preview={preview}
              previewAlt={`${category.name} photo`}
              hint="Upload a new photo to replace the current one."
              deleting={deletingPhoto}
              canDelete={Boolean(category.photo_url) && !file}
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
