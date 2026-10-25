import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import type { Voucher } from "@shared/commerce";
import { formatDate, formatDateTime } from "../utils/dateUtils";
import { discountLabel } from "./vouchers/format";

interface VoucherCodeItemProps {
  voucher: Voucher;
  isCopied: boolean;
  onCopy: (code: string) => void | Promise<void>;
  showHeader?: boolean;
}

export default function VoucherCodeItem({
  voucher,
  isCopied,
  onCopy,
  showHeader = false,
}: VoucherCodeItemProps) {
  const [copying, setCopying] = useState(false);

  const copy = async () => {
    if (copying) {
      return;
    }
    setCopying(true);
    try {
      await onCopy(voucher.code);
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="w-full rounded-ui border border-white/25 p-3">
      {showHeader ? (
        <p className="mb-2 text-center text-sm font-medium text-on-primary">
          Available voucher codes: {discountLabel(voucher)} off marked prices
        </p>
      ) : null}
      <div className="flex items-center justify-center gap-2">
        <span className="rounded-ui-sm bg-secondary px-3 py-1 font-mono text-2xl font-semibold text-on-secondary sm:text-4xl">
          {voucher.code}
        </span>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={copying}
          aria-busy={copying || undefined}
          aria-label={`Copy voucher code ${voucher.code}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-ui-sm bg-white/15 text-on-primary hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          {copying ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-on-primary border-t-transparent motion-safe:animate-spin" />
          ) : isCopied ? (
            <FaCheck className="text-xs" aria-hidden="true" />
          ) : (
            <FaCopy className="text-xs" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-on-primary/90">
        <span>
          Valid: {formatDate(voucher.start_date)} – {formatDate(voucher.end_date)}
        </span>
        <span aria-hidden="true">·</span>
        <span>Expires: {formatDateTime(voucher.end_date)}</span>
        {voucher.usage_limit_per_user ? (
          <>
            <span aria-hidden="true">·</span>
            <span>
              Limit: {voucher.usage_limit_per_user}{" "}
              {voucher.usage_limit_per_user === 1 ? "use" : "uses"} per user
            </span>
          </>
        ) : null}
      </p>
    </div>
  );
}
