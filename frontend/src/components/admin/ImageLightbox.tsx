import { useEffect } from "react";
import { Modal } from "../ui";
import { focusRing } from "../ui/styles";
import { mediaUrl } from "../../pages/admin/mediaFormat";

interface LightboxImage {
  image_url: string | null;
  product_name?: string | null;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export default function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!image) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return (
    <Modal open title={image.product_name || "Image"} onClose={onClose} className="max-w-4xl">
      <img src={mediaUrl(image.image_url)} alt={image.product_name || "Product image"} className={`max-h-[70vh] w-full object-contain ${focusRing}`} />
    </Modal>
  );
}
