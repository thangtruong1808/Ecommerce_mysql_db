import { useState, type FormEvent } from "react";
import type { Voucher } from "@shared/commerce";
import { Button, Modal } from "../ui";
import VoucherFormFields from "./VoucherFormFields";
import { readVoucherForm, type VoucherInput } from "../../pages/admin/voucherForm";

interface VoucherEditModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VoucherInput) => Promise<void>;
}

export default function VoucherEditModal({ voucher, isOpen, onClose, onSave }: VoucherEditModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!voucher || saving) {
      return;
    }
    setSaving(true);
    try {
      await onSave(readVoucherForm(new FormData(event.currentTarget)));
    } finally {
      setSaving(false);
    }
  };

  if (!voucher) {
    return null;
  }

  return (
    <Modal open={isOpen} title="Edit voucher" onClose={close} className="max-w-2xl">
      <form key={voucher.id} onSubmit={handleSubmit} className="space-y-4">
        <VoucherFormFields idPrefix="voucher-edit" voucher={voucher} />
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}
