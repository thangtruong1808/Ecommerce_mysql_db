import { FaEdit, FaTrash } from "react-icons/fa";
import type { Voucher } from "@shared/commerce";
import { Badge, Button } from "../ui";
import { CategorySelectBox } from "./categoryListChrome";
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
  const cell = "whitespace-nowrap px-3 py-3 font-ui text-sm text-ink";
  return (
    <tr className="hover:bg-surface-muted">
      <td className="px-3 py-3">
        <CategorySelectBox pressed={isSelected} label={`Select voucher ${voucher.code}`} onClick={() => onToggle(voucher.id)} />
      </td>
      <td className={`${cell} text-muted`}>{rowNumber}</td>
      <td className="whitespace-nowrap px-3 py-3">
        <span className="inline-flex rounded-ui bg-secondary px-2.5 py-1 font-mono text-sm font-semibold text-on-secondary">
          {voucher.code}
        </span>
      </td>
      <td className={cell}>{voucher.discount_type === "percentage" ? "Percentage" : "Fixed"}</td>
      <td className={`${cell} font-semibold`}>{discountLabel(voucher)}</td>
      <td className={`${cell} text-muted`}>{formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}</td>
      <td className={`${cell} text-muted`}>
        {voucher.current_usage_count}{voucher.total_usage_limit ? ` / ${voucher.total_usage_limit}` : " / ∞"}
      </td>
      <td className="whitespace-nowrap px-3 py-3"><Badge variant={status.variant}>{status.text}</Badge></td>
      <td className="whitespace-nowrap px-3 py-3 text-sm">
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
