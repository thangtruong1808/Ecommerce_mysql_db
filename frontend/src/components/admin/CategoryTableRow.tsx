import { FaEdit, FaTrash } from "react-icons/fa";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
import { focusRing } from "../ui/styles";
import { formatDate } from "../../utils/dateUtils";
import { photoSrc, type CategoryRecord } from "../../pages/admin/categoryTree";

interface CategoryTableRowProps {
  category: CategoryRecord;
  index: number;
  isSelected: boolean;
  onToggle: (id: number | string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryTableRow({
  category,
  index,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={category.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{index}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{category.id}</td>
      <td className="px-6 py-4">
        {category.photo_url ? (
          <img src={photoSrc(category.photo_url)} alt="" className="h-12 w-12 rounded-ui-sm object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-ui-sm bg-surface-muted text-xs text-muted">No photo</div>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium">{category.name}</td>
      <td className="px-6 py-4 text-sm text-muted">{category.description || "No description"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(category.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(category.updated_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onEdit} className={`inline-flex items-center gap-1 rounded-ui-sm bg-primary px-2 py-1 text-xs text-on-primary hover:bg-primary-hover ${focusRing}`} aria-label={`Edit ${category.name}`}>
            <FaEdit className="h-3 w-3" aria-hidden="true" />
            Edit
          </button>
          <button type="button" onClick={onDelete} className={`inline-flex items-center gap-1 rounded-ui-sm bg-danger px-2 py-1 text-xs text-on-danger hover:bg-danger-hover ${focusRing}`} aria-label={`Delete ${category.name}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
