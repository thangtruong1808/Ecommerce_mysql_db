import { useState } from "react";
import { toast } from "react-toastify";
import { FaCheck, FaCopy } from "react-icons/fa";
import type { Voucher } from "@shared/commerce";
import { formatDate } from "../utils/dateUtils";
import { Badge } from "./ui";
import { focusRing } from "./ui/styles";
import { daysUntil, discountLabel, moneyAmount } from "./vouchers/format";

interface VoucherCardProps {
  voucher: Voucher;
}

export default function VoucherCard({ voucher }: VoucherCardProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const daysLeft = daysUntil(voucher.end_date);
  const minimum = Number(voucher.min_purchase_amount);

  const copyCode = async () => {
    if (copying) {
      return;
    }
    setCopying(true);
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      toast.success("Voucher code copied!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    } finally {
      setCopying(false);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-ui border border-line bg-surface p-4 text-ink shadow-ui">
      <div className="flex items-start justify-between gap-3">
        <p className="text-3xl font-bold text-primary">{discountLabel(voucher)} off</p>
        <button
          type="button"
          onClick={() => void copyCode()}
          disabled={copying}
          aria-busy={copying || undefined}
          aria-label={`Copy voucher code ${voucher.code}`}
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-ui-sm border border-line bg-surface text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
        >
          {copying ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent motion-safe:animate-spin" />
          ) : copied ? (
            <FaCheck className="text-xs" aria-hidden="true" />
          ) : (
            <FaCopy className="text-xs" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="mt-3 inline-flex w-fit rounded-ui-sm bg-secondary px-3 py-1 font-mono text-lg font-semibold text-on-secondary">
        {voucher.code}
      </p>
      {voucher.description ? (
        <p className="mt-3 line-clamp-2 text-sm text-muted">{voucher.description}</p>
      ) : null}
      <div className="mt-auto space-y-2 pt-4 text-sm text-muted">
        {Number.isFinite(minimum) && minimum > 0 ? (
          <p>Min purchase: {moneyAmount(minimum)}</p>
        ) : null}
        <p>Valid until: {formatDate(voucher.end_date)}</p>
        {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 ? (
          <Badge variant="warning">
            Expires in {daysLeft} day{daysLeft === 1 ? "" : "s"}
          </Badge>
        ) : null}
      </div>
    </article>
  );
}
