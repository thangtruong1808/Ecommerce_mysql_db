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
      className="block h-full min-h-[200px] rounded-ui-lg border border-line bg-surface p-6 text-ink shadow-ui hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <FaTag className="text-2xl text-accent" aria-hidden="true" />
      <h4 className="mt-3 font-display text-2xl text-ink">{title}</h4>
      <p className="mt-2 text-sm text-muted">{detail}</p>
      <span className="mt-6 inline-block font-ui text-sm font-semibold text-primary">Shop now</span>
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
        className="h-full min-h-[200px] rounded-ui-lg bg-surface-muted motion-safe:animate-pulse"
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
