import { useState, type FormEvent } from "react";
import { Button, Modal } from "../ui";
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
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Create voucher</Button>
        </div>
      </form>
    </Modal>
  );
}
