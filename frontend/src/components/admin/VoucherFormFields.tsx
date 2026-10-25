import type { Voucher } from "@shared/commerce";
import { controlClass } from "../ui/styles";
import { dateTimeLocal } from "../../pages/admin/voucherForm";
import { isYes } from "../../pages/admin/dashboardFormat";

interface VoucherFormFieldsProps {
  idPrefix: string;
  voucher?: Voucher | null;
}

export default function VoucherFormFields({ idPrefix, voucher }: VoucherFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-code`} className="mb-1 block text-sm font-medium text-ink">Code</label>
        <input id={`${idPrefix}-code`} name="code" type="text" required maxLength={50} defaultValue={voucher?.code || ""} placeholder="VOUCHER123" className={controlClass()} autoComplete="off" />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-description`} className="mb-1 block text-sm font-medium text-ink">Description</label>
        <textarea id={`${idPrefix}-description`} name="description" rows={3} defaultValue={voucher?.description || ""} placeholder="Voucher description..." className={controlClass()} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-type`} className="mb-1 block text-sm font-medium text-ink">Discount type</label>
          <select id={`${idPrefix}-type`} name="discount_type" required defaultValue={voucher?.discount_type || ""} className={controlClass()}>
            {voucher ? null : <option value="">Select type</option>}
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-value`} className="mb-1 block text-sm font-medium text-ink">Discount value</label>
          <input id={`${idPrefix}-value`} name="discount_value" type="number" required min="0" step="0.01" defaultValue={voucher ? String(voucher.discount_value) : ""} placeholder="10" className={controlClass()} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-min`} className="mb-1 block text-sm font-medium text-ink">Min purchase amount</label>
          <input id={`${idPrefix}-min`} name="min_purchase_amount" type="number" min="0" step="0.01" defaultValue={voucher ? String(voucher.min_purchase_amount ?? 0) : "0"} className={controlClass()} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-max`} className="mb-1 block text-sm font-medium text-ink">Max discount for percentage</label>
          <input id={`${idPrefix}-max`} name="max_discount_amount" type="number" min="0" step="0.01" defaultValue={voucher?.max_discount_amount ?? ""} placeholder="Optional" className={controlClass()} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-start`} className="mb-1 block text-sm font-medium text-ink">Start date</label>
          <input id={`${idPrefix}-start`} name="start_date" type="datetime-local" required defaultValue={voucher ? dateTimeLocal(voucher.start_date) : ""} className={controlClass()} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-end`} className="mb-1 block text-sm font-medium text-ink">End date</label>
          <input id={`${idPrefix}-end`} name="end_date" type="datetime-local" required defaultValue={voucher ? dateTimeLocal(voucher.end_date) : ""} className={controlClass()} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-per-user`} className="mb-1 block text-sm font-medium text-ink">Usage limit per user</label>
          <input id={`${idPrefix}-per-user`} name="usage_limit_per_user" type="number" min="1" defaultValue={voucher?.usage_limit_per_user || 1} className={controlClass()} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-total`} className="mb-1 block text-sm font-medium text-ink">Total usage limit</label>
          <input id={`${idPrefix}-total`} name="total_usage_limit" type="number" min="1" defaultValue={voucher?.total_usage_limit ?? ""} placeholder="Unlimited if empty" className={controlClass()} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-ink" htmlFor={`${idPrefix}-active`}>
        <input id={`${idPrefix}-active`} name="is_active" type="checkbox" defaultChecked={voucher ? isYes(voucher.is_active) : true} className="h-4 w-4 accent-primary" />
        Active
      </label>
    </div>
  );
}
