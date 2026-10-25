import { useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { Voucher } from "@shared/commerce";
import { Button } from "./ui";
import { controlClass } from "./ui/styles";
import { moneyAmount, voucherError } from "./vouchers/format";

interface VoucherFormProps {
  orderTotal: number;
  onVoucherApplied?: (voucher: Voucher, discount: number) => void;
  onVoucherRemoved?: () => void;
}

interface ValidateResponse {
  valid?: boolean;
  voucher?: Voucher;
  discount_amount?: unknown;
  message?: string;
}

export default function VoucherForm({
  orderTotal,
  onVoucherApplied,
  onVoucherRemoved,
}: VoucherFormProps) {
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const applyVoucher = async () => {
    if (loading) {
      return;
    }
    const code = voucherCode.trim();
    if (!code) {
      setError("Enter a voucher code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post<ValidateResponse>(
        "/api/vouchers/validate",
        { code, order_total: orderTotal },
        { withCredentials: true },
      );
      const voucher = response.data.voucher;
      const discount = Number(response.data.discount_amount);
      if (!response.data.valid || !voucher?.code || !Number.isFinite(discount)) {
        const message = response.data.message || "Invalid voucher code";
        setError(message);
        toast.error(message);
        return;
      }
      setAppliedVoucher(voucher);
      setDiscountAmount(discount);
      toast.success("Voucher applied successfully!");
      onVoucherApplied?.(voucher, discount);
    } catch (requestError: unknown) {
      const message = voucherError(requestError, "Failed to validate voucher");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherCode("");
    setError("");
    onVoucherRemoved?.();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void applyVoucher();
  };

  if (appliedVoucher) {
    return (
      <div className="rounded-ui border border-success/40 bg-success/10 p-4" role="status">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-ink">Voucher: {appliedVoucher.code}</p>
            <p className="text-sm text-success">Discount: {moneyAmount(discountAmount)}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={removeVoucher}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-ui border border-line bg-surface-muted p-4">
      <label htmlFor="checkout-voucher" className="text-sm font-medium text-ink">
        Voucher code
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="checkout-voucher"
          type="text"
          value={voucherCode}
          onChange={(event) => {
            setVoucherCode(event.target.value.toUpperCase());
            if (error) {
              setError("");
            }
          }}
          placeholder="Enter voucher code"
          autoComplete="off"
          disabled={loading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "checkout-voucher-error" : undefined}
          className={controlClass(Boolean(error)) + " uppercase sm:flex-1"}
        />
        <Button type="submit" loading={loading}>
          Apply
        </Button>
      </div>
      {error ? (
        <p id="checkout-voucher-error" role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}
