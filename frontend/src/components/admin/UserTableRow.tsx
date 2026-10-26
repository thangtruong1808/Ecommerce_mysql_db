import { FaEdit, FaTrash } from "react-icons/fa";
import type { User } from "@shared/auth";
import { Button } from "../ui";
import { CategorySelectBox } from "./categoryListChrome";
import StatusBadge from "./StatusBadge";
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
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-muted";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select ${user.name}`} onClick={() => onToggle(user.id)} />
      </td>
      <td className={`${cell} text-ink`}>{rowNumber}</td>
      <td className={`${cell} text-ink`}>{user.id}</td>
      <td className="whitespace-nowrap px-3 py-3 font-ui text-sm font-semibold text-ink">{user.name}</td>
      <td className={cell}>{user.email}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
        <StatusBadge
          currentStatus={user.role}
          availableStatuses={["user", "admin"]}
          onStatusChange={onRoleChange}
          entityType="user role"
          loading={roleBusy}
        />
      </td>
      <td className={cell}>{formatDate(user.created_at || "")}</td>
      <td className={cell}>{formatDate(user.updated_at || "")}</td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
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
