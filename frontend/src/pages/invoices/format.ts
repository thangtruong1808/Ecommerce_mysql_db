import axios from "axios";
import { messageFrom } from "../orders/format";

export interface AddressValue {
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export function addressLines(value: unknown): string[] {
  if (!value) return ["Not available"];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return ["Not available"];
    try {
      return addressLines(JSON.parse(trimmed) as unknown);
    } catch {
      return [trimmed];
    }
  }
  if (typeof value === "object") {
    const address = value as AddressValue;
    const lines = [
      address.address,
      [address.city, address.postal_code].filter(Boolean).join(", "),
      address.country,
    ].filter((line): line is string => Boolean(line));
    return lines.length > 0 ? lines : ["Not available"];
  }
  return ["Not available"];
}

export async function downloadMessage(error: unknown): Promise<string> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      const data = JSON.parse(text) as { message?: string };
      return data.message || "Failed to download invoice";
    } catch {
      return "Failed to download invoice";
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return messageFrom(error, "Failed to download invoice");
}
