import { FaEdit, FaTrash } from "react-icons/fa";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
import { focusRing } from "../ui/styles";
import { formatDate } from "../../utils/dateUtils";
import type { ChildCategoryRecord } from "../../pages/admin/categoryTree";

interface ChildCategoryTableRowProps {
  childCategory: ChildCategoryRecord;
  index: number;
  isSelected: boolean;
  onToggle: (id: number | string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ChildCategoryTableRow({
  childCategory,
  index,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: ChildCategoryTableRowProps) {
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={childCategory.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{index}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{childCategory.id}</td>
      <td className="px-6 py-4 text-sm font-medium">{childCategory.name}</td>
      <td className="px-6 py-4 text-sm text-muted">{childCategory.category_name || "N/A"}</td>
      <td className="px-6 py-4 text-sm text-muted">{childCategory.subcategory_name || "N/A"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{childCategory.subcategory_id}</td>
      <td className="px-6 py-4 text-sm text-muted">{childCategory.description || "No description"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(childCategory.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(childCategory.updated_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onEdit} className={`inline-flex items-center gap-1 rounded-ui-sm bg-primary px-2 py-1 text-xs text-on-primary hover:bg-primary-hover ${focusRing}`} aria-label={`Edit ${childCategory.name}`}>
            <FaEdit className="h-3 w-3" aria-hidden="true" />
            Edit
          </button>
          <button type="button" onClick={onDelete} className={`inline-flex items-center gap-1 rounded-ui-sm bg-danger px-2 py-1 text-xs text-on-danger hover:bg-danger-hover ${focusRing}`} aria-label={`Delete ${childCategory.name}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
