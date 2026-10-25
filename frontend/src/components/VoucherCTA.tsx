import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { Voucher } from "@shared/commerce";
import { FaTag } from "react-icons/fa";
import { discountLabel } from "./vouchers/format";

function asVoucher(data: unknown): Voucher | null {
  if (!Array.isArray(data)) {
    return null;
  }
  const first = data.find((item) => {
    return Boolean(item) && typeof item === "object" && typeof (item as Voucher).code === "string";
  });
  return (first as Voucher | undefined) ?? null;
}

function PromoLink({ title, detail }: { title: string; detail: string }) {
  return (
    <Link
      to="/products"
      className="block h-full min-h-[200px] rounded-ui bg-primary p-6 text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <FaTag className="text-3xl" aria-hidden="true" />
      <h4 className="mt-2 text-2xl font-bold">{title}</h4>
      <p className="mt-1 text-sm text-on-primary/90">{detail}</p>
      <span className="mt-6 inline-block text-sm font-semibold underline">Shop now</span>
    </Link>
  );
}

export default function VoucherCTA() {
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await axios.get<unknown>("/api/vouchers");
        if (active) {
          setVoucher(asVoucher(response.data));
        }
      } catch {
        if (active) {
          setVoucher(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="h-full min-h-[200px] motion-safe:animate-pulse rounded-ui bg-primary/20"
        aria-hidden="true"
      />
    );
  }

  if (!voucher) {
    return (
      <PromoLink title="Special offers" detail="Check out the latest deals and discounts." />
    );
  }

  return (
    <PromoLink
      title={`Use code: ${voucher.code}`}
      detail={`${discountLabel(voucher)} off${voucher.description ? `. ${voucher.description}` : ""}`}
    />
  );
}
