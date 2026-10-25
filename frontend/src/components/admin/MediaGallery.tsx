import { useState } from "react";
import { FaEye, FaStar, FaTrash } from "react-icons/fa";
import { Badge } from "../ui";
import { focusRing } from "../ui/styles";
import ImageLightbox from "./ImageLightbox";
import { mediaUrl } from "../../pages/admin/mediaFormat";
import type { ProductImage } from "@shared/catalog";

interface MediaGalleryProps {
  images: ProductImage[];
  busy?: boolean;
  onSetPrimary: (imageId: number) => void;
  onDelete: (imageId: number) => void;
}

export default function MediaGallery({ images, busy = false, onSetPrimary, onDelete }: MediaGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<ProductImage | null>(null);

  if (images.length === 0) {
    return <p className="py-12 text-center text-muted">No images available</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-ui border border-line bg-surface">
            <img src={mediaUrl(image.image_url)} alt="" className="h-32 w-full object-cover" />
            <div className="flex items-center justify-between gap-1 p-2">
              {image.is_primary ? <Badge variant="warning">Primary</Badge> : <span className="text-xs text-muted">Image {image.id}</span>}
              <div className="flex gap-1">
                <button type="button" onClick={() => setLightboxImage(image)} className={`rounded-ui-sm p-2 text-primary hover:bg-surface-muted ${focusRing}`} aria-label={`View image ${image.id}`}>
                  <FaEye aria-hidden="true" />
                </button>
                {!image.is_primary ? (
                  <button type="button" disabled={busy} onClick={() => onSetPrimary(image.id)} className={`rounded-ui-sm p-2 text-ink hover:bg-surface-muted disabled:opacity-60 ${focusRing}`} aria-label={`Set image ${image.id} as primary`}>
                    <FaStar aria-hidden="true" />
                  </button>
                ) : null}
                <button type="button" disabled={busy} onClick={() => onDelete(image.id)} className={`rounded-ui-sm p-2 text-danger hover:bg-surface-muted disabled:opacity-60 ${focusRing}`} aria-label={`Delete image ${image.id}`}>
                  <FaTrash aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </>
  );
}
