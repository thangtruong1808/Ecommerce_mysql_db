import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal } from "../ui";
import { controlClass } from "../ui/styles";
import CategoryPhotoField from "./CategoryPhotoField";
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
    <Modal open={isOpen && Boolean(subcategory)} title="Edit subcategory" onClose={close}>
      {subcategory ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subcategory-edit-parent" className="mb-1 block text-sm font-medium text-ink">Category</label>
            <select id="subcategory-edit-parent" name="category_id" required defaultValue={subcategory.category_id} className={controlClass()}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory-edit-name" className="mb-1 block text-sm font-medium text-ink">Name</label>
            <input id="subcategory-edit-name" name="name" type="text" required defaultValue={subcategory.name} className={controlClass()} />
          </div>
          <div>
            <label htmlFor="subcategory-edit-description" className="mb-1 block text-sm font-medium text-ink">Description</label>
            <textarea id="subcategory-edit-description" name="description" rows={3} defaultValue={subcategory.description || ""} className={controlClass()} />
          </div>
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
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={close} disabled={busy}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={deletingPhoto}>Save</Button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
