import { useState, type FormEvent } from "react";
import { Modal, Select } from "../ui";
import { CategoryDialogActions, CategorySection } from "./categoryDialogChrome";
import { isYes } from "../../pages/admin/dashboardFormat";
import type { AdminInvoice } from "./InvoiceTableRow";

export interface InvoiceEditInput {
  payment_status: string;
  email_sent: boolean;
}

interface InvoiceEditModalProps {
  invoice: AdminInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvoiceEditInput) => Promise<void>;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
];

const emailOptions = [
  { value: "false", label: "No" },
  { value: "true", label: "Yes" },
];

export default function InvoiceEditModal({ invoice, isOpen, onClose, onSave }: InvoiceEditModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invoice || saving) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const paymentStatus = String(formData.get("payment_status") || "");
    if (!paymentStatus) {
      return;
    }
    setSaving(true);
    try {
      await onSave({
        payment_status: paymentStatus,
        email_sent: formData.get("email_sent") === "true",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!invoice) {
    return null;
  }

  const currentStatus = invoice.payment_status || "pending";
  const options = statusOptions.some((option) => option.value === currentStatus)
    ? statusOptions
    : [{ value: currentStatus, label: currentStatus }, ...statusOptions];

  return (
    <Modal open={isOpen} title="Edit invoice" onClose={close}>
      <form key={invoice.id} onSubmit={handleSubmit} className="space-y-4">
        <CategorySection title="Payment">
          <Select
            id="invoice-edit-status"
            name="payment_status"
            label="Payment Status"
            defaultValue={currentStatus}
            options={options}
          />
          <Select
            id="invoice-edit-email"
            name="email_sent"
            label="Email Sent"
            defaultValue={isYes(invoice.email_sent) ? "true" : "false"}
            options={emailOptions}
          />
        </CategorySection>
        <CategoryDialogActions onCancel={close} submitLabel="Save" saving={saving} />
      </form>
    </Modal>
  );
}
