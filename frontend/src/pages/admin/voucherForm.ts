import type { DiscountType } from "@shared/common";
import type { Voucher } from "@shared/commerce";
import type { BadgeVariant } from "../../components/ui";
import { isYes } from "./dashboardFormat";

export interface VoucherInput {
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  start_date: string;
  end_date: string;
  usage_limit_per_user: number;
  total_usage_limit: number | null;
  is_active: boolean;
}

function finiteNumber(value: FormDataEntryValue | null, fallback: number | null): number | null {
  if (value == null || String(value).trim() === "") {
    return fallback;
  }
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : fallback;
}

export function readVoucherForm(formData: FormData): VoucherInput {
  const discountType = String(formData.get("discount_type") || "");
  return {
    code: String(formData.get("code") || "").toUpperCase().trim(),
    description: String(formData.get("description") || "").trim() || null,
    discount_type: discountType === "fixed" ? "fixed" : "percentage",
    discount_value: finiteNumber(formData.get("discount_value"), 0) ?? 0,
    min_purchase_amount: finiteNumber(formData.get("min_purchase_amount"), 0) ?? 0,
    max_discount_amount: finiteNumber(formData.get("max_discount_amount"), null),
    start_date: String(formData.get("start_date") || ""),
    end_date: String(formData.get("end_date") || ""),
    usage_limit_per_user: finiteNumber(formData.get("usage_limit_per_user"), 1) ?? 1,
    total_usage_limit: finiteNumber(formData.get("total_usage_limit"), null),
    is_active: formData.get("is_active") === "on",
  };
}

export function dateTimeLocal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
}

export function discountLabel(voucher: Pick<Voucher, "discount_type" | "discount_value">): string {
  const amount = Number(voucher.discount_value);
  if (!Number.isFinite(amount)) {
    return "N/A";
  }
  if (voucher.discount_type === "percentage") {
    return `${amount}%`;
  }
  return `$${amount.toFixed(2)}`;
}

export function voucherStatus(voucher: Pick<Voucher, "is_active" | "start_date" | "end_date">): { text: string; variant: BadgeVariant } {
  if (!isYes(voucher.is_active)) {
    return { text: "Inactive", variant: "neutral" };
  }
  const start = new Date(voucher.start_date).getTime();
  const end = new Date(voucher.end_date).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return { text: "Inactive", variant: "neutral" };
  }
  const now = Date.now();
  if (now < start) {
    return { text: "Not Started", variant: "warning" };
  }
  if (now > end) {
    return { text: "Expired", variant: "neutral" };
  }
  return { text: "Active", variant: "success" };
}

export function matchesVoucherFilter(voucher: Voucher, statusFilter: string): boolean {
  if (!statusFilter) {
    return true;
  }
  const now = Date.now();
  const start = new Date(voucher.start_date).getTime();
  const end = new Date(voucher.end_date).getTime();
  if (statusFilter === "active") {
    return isYes(voucher.is_active) && Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end;
  }
  if (statusFilter === "inactive") {
    return !isYes(voucher.is_active) || !Number.isFinite(start) || now < start;
  }
  if (statusFilter === "expired") {
    return Number.isFinite(end) && now > end;
  }
  return true;
}

export function sortVouchers(vouchers: Voucher[], sortBy: string, sortOrder: string): Voucher[] {
  if (sortBy === "created_at" && sortOrder === "desc") {
    return vouchers;
  }
  const direction = sortOrder === "asc" ? 1 : -1;
  return [...vouchers].sort((left, right) => {
    if (sortBy === "discount_value") {
      return (Number(left.discount_value) - Number(right.discount_value)) * direction;
    }
    const leftValue = String(left[sortBy as keyof Voucher] ?? "");
    const rightValue = String(right[sortBy as keyof Voucher] ?? "");
    return leftValue.localeCompare(rightValue, undefined, { numeric: true }) * direction;
  });
}
