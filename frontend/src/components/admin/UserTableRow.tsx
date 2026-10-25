import { FaEdit, FaTrash } from "react-icons/fa";
import type { User } from "@shared/auth";
import { Button } from "../ui";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
import InlineEditCell from "./InlineEditCell";
import { formatDate } from "../../utils/dateUtils";

interface UserTableRowProps {
  user: User;
  rowNumber: number;
  isSelected: boolean;
  roleBusy: boolean;
  onToggle: (id: number | string) => void;
  onRoleChange: (role: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserTableRow({
  user,
  rowNumber,
  isSelected,
  roleBusy,
  onToggle,
  onRoleChange,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={user.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{rowNumber}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{user.id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{user.name}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{user.email}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <InlineEditCell
          value={user.role}
          type="select"
          options={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
          loading={roleBusy}
          onSave={(role: string | number) => onRoleChange(String(role))}
        />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(user.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(user.updated_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={onEdit} disabled={roleBusy} aria-label={`Edit ${user.name}`}>
            <FaEdit className="h-3 w-3" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete} disabled={roleBusy} aria-label={`Delete ${user.name}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
