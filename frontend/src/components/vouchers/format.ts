import axios from "axios";
import type { Voucher } from "@shared/commerce";

export function discountLabel(voucher: Pick<Voucher, "discount_type" | "discount_value">): string {
  const value = Number(voucher.discount_value);
  if (!Number.isFinite(value)) {
    return "Discount";
  }
  if (voucher.discount_type === "percentage") {
    return `${Math.round(value)}%`;
  }
  return `$${value.toFixed(2)}`;
}

export function moneyAmount(value: unknown): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "$0.00";
  }
  return `$${amount.toFixed(2)}`;
}

export function daysUntil(endDate: string): number | null {
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return null;
  }
  return Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function voucherError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { msg?: string }[] }
      | undefined;
    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }
    const first = data?.errors?.find((item) => typeof item?.msg === "string")?.msg;
    if (first) {
      return first;
    }
  }
  return fallback;
}
