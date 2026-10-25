import type { DecimalValue, SqlBoolean } from "@shared/common";
import type { BadgeVariant } from "../../components/ui";
import axios from "axios";

export interface OrderListItem {
  id: number;
  order_number?: string | null;
  created_at?: string;
  item_count?: number | string;
  total_price?: DecimalValue;
  tax_price?: DecimalValue;
  shipping_price?: DecimalValue;
  voucher_discount?: DecimalValue;
  is_paid?: SqlBoolean;
  is_delivered?: SqlBoolean;
  paid_at?: string | null;
  payment_method?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface PageInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function money(value: DecimalValue | null | undefined): string {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

export function isYes(value: SqlBoolean | null | undefined): boolean {
  return value === true || value === 1;
}

export function formatWhen(value: string | null | undefined): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}-${months[date.getMonth()]}-${date.getFullYear()}, ${hours}:${minutes} ${suffix}`;
}

export function orderNumber(order: OrderListItem): string {
  if (order.order_number) return order.order_number;
  const date = order.created_at ? new Date(order.created_at) : null;
  const datePart = date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10).replace(/-/g, "")
    : "00000000";
  return `ORD-${datePart}-${String(order.id).padStart(5, "0")}`;
}

export function orderStatus(order: OrderListItem): { label: string; variant: BadgeVariant } {
  if (isYes(order.is_delivered)) return { label: "Delivered", variant: "success" };
  if (isYes(order.is_paid)) return { label: "Processing", variant: "primary" };
  return { label: "Pending payment", variant: "warning" };
}

export function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

export function pageInfo(value: Partial<PageInfo> | undefined, page: number): PageInfo {
  const info = value || {};
  return {
    page: Number(info.page) || page,
    limit: Number(info.limit) || 10,
    total: Number(info.total) || 0,
    pages: Number(info.pages) || 0,
  };
}
