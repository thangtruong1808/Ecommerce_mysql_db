import { FaEdit, FaTrash } from "react-icons/fa";
import type { Voucher } from "@shared/commerce";
import { Badge, Button } from "../ui";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
import { formatDate } from "../../utils/dateUtils";
import { discountLabel, voucherStatus } from "../../pages/admin/voucherForm";

interface VoucherTableRowProps {
  voucher: Voucher;
  rowNumber: number;
  isSelected: boolean;
  onToggle: (id: number | string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VoucherTableRow({
  voucher,
  rowNumber,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: VoucherTableRowProps) {
  const status = voucherStatus(voucher);
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4">
        <BulkSelectCheckbox itemId={voucher.id} isSelected={isSelected} onToggle={onToggle} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{rowNumber}</td>
      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-semibold">{voucher.code}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{voucher.discount_type === "percentage" ? "Percentage" : "Fixed"}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{discountLabel(voucher)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
        {voucher.current_usage_count}{voucher.total_usage_limit ? ` / ${voucher.total_usage_limit}` : " / ∞"}
      </td>
      <td className="whitespace-nowrap px-6 py-4"><Badge variant={status.variant}>{status.text}</Badge></td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={onEdit} aria-label={`Edit ${voucher.code}`}>
            <FaEdit className="h-3 w-3" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete} aria-label={`Delete ${voucher.code}`}>
            <FaTrash className="h-3 w-3" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
