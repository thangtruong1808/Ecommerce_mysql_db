import { Link } from "react-router-dom";
import { FaEye, FaStar, FaTrash } from "react-icons/fa";
import { CategorySelectBox } from "./categoryListChrome";
import { Badge } from "../ui";
import { focusRing } from "../ui/styles";
import { formatDate } from "../../utils/dateUtils";
import { mediaUrl } from "../../pages/admin/mediaFormat";
import type { ProductImage } from "@shared/catalog";

export interface AdminImage extends ProductImage {
  product_name?: string | null;
}

interface ImageTableRowProps {
  image: AdminImage;
  isSelected: boolean;
  onToggle: (id: number | string) => void;
  onView: () => void;
  onSetPrimary: (imageId: number) => void;
  onDelete: (imageId: number) => void;
}

export default function ImageTableRow({ image, isSelected, onToggle, onView, onSetPrimary, onDelete }: ImageTableRowProps) {
  const name = image.product_name || `Product #${image.product_id}`;
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui">
      <div className="relative">
        <button type="button" onClick={onView} className={`block w-full ${focusRing}`} aria-label={`View image ${image.id}`}>
          <img src={mediaUrl(image.image_url)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
        </button>
        <div className="absolute left-2 top-2">
          <CategorySelectBox pressed={isSelected} label={`Select image ${image.id}`} onClick={() => onToggle(image.id)} />
        </div>
        {image.is_primary ? (
          <div className="absolute right-2 top-2">
            <Badge variant="warning">Primary</Badge>
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <Link to={`/admin/products/${image.product_id}/edit`} className={`truncate font-ui text-sm font-semibold text-ink hover:text-primary ${focusRing}`} title={name}>
          {name}
        </Link>
        <p className="font-ui text-xs text-muted">{formatDate(image.created_at || "")}</p>
        <div className="mt-auto flex items-center gap-1">
          <button type="button" onClick={onView} className={`rounded-ui-sm p-2 text-primary hover:bg-surface-muted ${focusRing}`} aria-label={`View image ${image.id}`}>
            <FaEye aria-hidden="true" />
          </button>
          {!image.is_primary ? (
            <button type="button" onClick={() => onSetPrimary(image.id)} className={`rounded-ui-sm p-2 text-ink hover:bg-surface-muted ${focusRing}`} aria-label={`Set image ${image.id} as primary`}>
              <FaStar aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" onClick={() => onDelete(image.id)} className={`rounded-ui-sm p-2 text-danger hover:bg-surface-muted ${focusRing}`} aria-label={`Delete image ${image.id}`}>
            <FaTrash aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
