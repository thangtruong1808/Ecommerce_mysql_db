import { Link } from "react-router-dom";
import { FaEye, FaStar, FaTrash } from "react-icons/fa";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
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
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4"><BulkSelectCheckbox itemId={image.id} isSelected={isSelected} onToggle={onToggle} /></td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{image.id}</td>
      <td className="px-6 py-4">
        <button type="button" onClick={onView} className={focusRing} aria-label={`View image ${image.id}`}>
          <img src={mediaUrl(image.image_url)} alt="" className="h-16 w-16 rounded-ui-sm object-cover" />
        </button>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <Link to={`/admin/products/${image.product_id}/edit`} className={`text-primary hover:underline ${focusRing}`}>{name}</Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        {image.is_primary ? <Badge variant="warning">Primary</Badge> : (
          <button type="button" onClick={() => onSetPrimary(image.id)} className={`text-muted hover:text-ink ${focusRing}`} aria-label={`Set image ${image.id} as primary`}>
            <FaStar aria-hidden="true" />
          </button>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(image.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onView} className={`text-primary ${focusRing}`} aria-label={`View image ${image.id}`}><FaEye aria-hidden="true" /></button>
          <button type="button" onClick={() => onDelete(image.id)} className={`text-danger ${focusRing}`} aria-label={`Delete image ${image.id}`}><FaTrash aria-hidden="true" /></button>
        </div>
      </td>
    </tr>
  );
}
