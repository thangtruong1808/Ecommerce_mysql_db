import type { FormEvent } from "react";
import { useState } from "react";
import type { User } from "@shared/auth";
import type { UserRole } from "@shared/common";
import { Button, Input, Modal, Select } from "../ui";

export interface UserEditInput {
  name: string;
  email: string;
  role: UserRole;
}

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserEditInput) => Promise<void>;
}

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || saving) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const role = String(formData.get("role") || user.role);
    setSaving(true);
    try {
      await onSave({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        role: role === "admin" ? "admin" : "user",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Modal open={isOpen} title="Edit user" onClose={close}>
      <form key={user.id} onSubmit={handleSubmit} className="space-y-4">
        <Input id="user-edit-name" name="name" label="Name" defaultValue={user.name} required autoComplete="name" />
        <Input id="user-edit-email" name="email" type="email" label="Email" defaultValue={user.email} required autoComplete="off" />
        <Select id="user-edit-role" name="role" label="Role" defaultValue={user.role} options={roles} />
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}
