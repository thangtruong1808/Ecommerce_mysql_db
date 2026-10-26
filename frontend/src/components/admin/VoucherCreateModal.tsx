import { useState, type FormEvent } from "react";
import { Modal } from "../ui";
import { CategoryDialogActions } from "./categoryDialogChrome";
import VoucherFormFields from "./VoucherFormFields";
import { readVoucherForm, type VoucherInput } from "../../pages/admin/voucherForm";

interface VoucherCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VoucherInput) => Promise<void>;
}

export default function VoucherCreateModal({ isOpen, onClose, onSave }: VoucherCreateModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      await onSave(readVoucherForm(new FormData(event.currentTarget)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen} title="Create voucher" onClose={close} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <VoucherFormFields idPrefix="voucher-create" />
        <CategoryDialogActions onCancel={close} submitLabel="Create voucher" saving={saving} />
      </form>
    </Modal>
  );
}
