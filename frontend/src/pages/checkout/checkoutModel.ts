import { useEffect, useState } from "react";
import axios from "axios";
import type { ShippingQuote, ShippingQuoteRequest } from "@shared/commerce";
import type { UserAddress } from "@shared/auth";

export interface AddressFields {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const fallbackQuote = (subtotal: number): ShippingQuote => ({
  amount: subtotal > 100 ? 0 : 10,
  service: "Standard Shipping",
  source: "fallback",
  estimated_days: "3-5 business days",
});

export function money(value: number): string {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

export function messageFrom(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { msg?: string }[] } | undefined;
    return data?.errors?.[0]?.msg || data?.message || error.message || "Failed to place order";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Failed to place order";
}

export function isDefaultAddress(address: UserAddress): boolean {
  return address.is_default === true || address.is_default === 1;
}

export function addressValues(address: UserAddress): AddressFields {
  return {
    address: address.address || "",
    city: address.city || "",
    postalCode: address.postal_code || "",
    country: address.country || "",
  };
}

export function useShippingQuote(subtotal: number, postalCode: string, country: string) {
  const [quote, setQuote] = useState<ShippingQuote>(() => fallbackQuote(subtotal));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fallback = fallbackQuote(subtotal);
    const destinationPostcode = postalCode.trim();
    const destinationCountry = country.trim();
    if (!destinationPostcode || !destinationCountry) {
      setQuote(fallback);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const body: ShippingQuoteRequest = {
            subtotal,
            destinationPostcode,
            destinationCountry,
          };
          const response = await axios.post<Partial<ShippingQuote>>("/api/shipping/quote", body);
          if (!active) return;
          const data = response.data;
          setQuote({
            amount: Number(data.amount) || 0,
            service: data.service || fallback.service,
            source: data.source === "auspost_pac" ? "auspost_pac" : "fallback",
            estimated_days: data.estimated_days || fallback.estimated_days,
          });
        } catch {
          if (!active) return;
          setQuote(fallback);
        } finally {
          if (active) setLoading(false);
        }
      })();
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [subtotal, postalCode, country]);

  return { quote, loading };
}
