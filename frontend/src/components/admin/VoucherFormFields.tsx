import type { Voucher } from "@shared/commerce";
import { Input, Select } from "../ui";
import { CategorySection, CategoryTextarea } from "./categoryDialogChrome";
import { dateTimeLocal } from "../../pages/admin/voucherForm";
import { isYes } from "../../pages/admin/dashboardFormat";

interface VoucherFormFieldsProps {
  idPrefix: string;
  voucher?: Voucher | null;
}

export default function VoucherFormFields({ idPrefix, voucher }: VoucherFormFieldsProps) {
  const typeOptions = [
    ...(voucher ? [] : [{ value: "", label: "Select type" }]),
    { value: "percentage", label: "Percentage" },
    { value: "fixed", label: "Fixed amount" },
  ];

  return (
    <div className="space-y-4">
      <CategorySection title="Offer">
        <Input id={`${idPrefix}-code`} name="code" label="Code" required maxLength={50} defaultValue={voucher?.code || ""} placeholder="VOUCHER123" autoComplete="off" />
        <CategoryTextarea id={`${idPrefix}-description`} name="description" label="Description" defaultValue={voucher?.description || ""} placeholder="Voucher description..." />
      </CategorySection>
      <CategorySection title="Discount">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select id={`${idPrefix}-type`} name="discount_type" label="Discount type" required defaultValue={voucher?.discount_type || ""} options={typeOptions} />
          <Input id={`${idPrefix}-value`} name="discount_value" label="Discount value" type="number" required min="0" step="0.01" defaultValue={voucher ? String(voucher.discount_value) : ""} placeholder="10" />
          <Input id={`${idPrefix}-min`} name="min_purchase_amount" label="Min purchase amount" type="number" min="0" step="0.01" defaultValue={voucher ? String(voucher.min_purchase_amount ?? 0) : "0"} />
          <Input id={`${idPrefix}-max`} name="max_discount_amount" label="Max discount for percentage" type="number" min="0" step="0.01" defaultValue={voucher?.max_discount_amount ?? ""} placeholder="Optional" />
        </div>
      </CategorySection>
      <CategorySection title="Schedule">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id={`${idPrefix}-start`} name="start_date" label="Start date" type="datetime-local" required defaultValue={voucher ? dateTimeLocal(voucher.start_date) : ""} />
          <Input id={`${idPrefix}-end`} name="end_date" label="End date" type="datetime-local" required defaultValue={voucher ? dateTimeLocal(voucher.end_date) : ""} />
        </div>
      </CategorySection>
      <CategorySection title="Limits">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id={`${idPrefix}-per-user`} name="usage_limit_per_user" label="Usage limit per user" type="number" min="1" defaultValue={voucher?.usage_limit_per_user || 1} />
          <Input id={`${idPrefix}-total`} name="total_usage_limit" label="Total usage limit" type="number" min="1" defaultValue={voucher?.total_usage_limit ?? ""} placeholder="Unlimited if empty" />
        </div>
        <label className="flex items-center gap-2 font-ui text-sm font-semibold text-ink" htmlFor={`${idPrefix}-active`}>
          <input id={`${idPrefix}-active`} name="is_active" type="checkbox" defaultChecked={voucher ? isYes(voucher.is_active) : true} className="h-4 w-4 accent-primary" />
          Active
        </label>
      </CategorySection>
    </div>
  );
}
