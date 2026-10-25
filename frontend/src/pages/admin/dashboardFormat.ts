import axios from "axios";
import type { SqlBoolean } from "@shared/common";

export function money(value: unknown): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "$0.00";
  }
  return `$${amount.toFixed(2)}`;
}

export function isYes(value: SqlBoolean | null | undefined): boolean {
  return value === true || value === 1;
}

export function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

export function activityWhen(value: unknown): string {
  if (!value) {
    return "";
  }
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function orderNumber(order: { id: number; order_number?: string | null; created_at?: string }): string {
  if (order.order_number) {
    return order.order_number;
  }
  const date = new Date(order.created_at || "");
  const stamp = Number.isNaN(date.getTime())
    ? "00000000"
    : date.toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${stamp}-${String(order.id).padStart(5, "0")}`;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function cssColor(variable: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  if (!raw) {
    return fallback;
  }
  return `rgb(${raw.replace(/ /g, ", ")})`;
}
