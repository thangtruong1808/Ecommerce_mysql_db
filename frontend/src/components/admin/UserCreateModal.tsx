import type { FormEvent } from "react";
import { useState } from "react";
import type { UserRole } from "@shared/common";
import { Input, Modal, Select } from "../ui";
import { CategoryDialogActions, CategorySection } from "./categoryDialogChrome";

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserCreateInput) => Promise<void>;
}

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

export default function UserCreateModal({ isOpen, onClose, onSave }: UserCreateModalProps) {
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
    const formData = new FormData(event.currentTarget);
    const role = String(formData.get("role") || "user");
    setSaving(true);
    try {
      await onSave({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        role: role === "admin" ? "admin" : "user",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={isOpen} title="Add user" onClose={close}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CategorySection title="Account">
          <Input id="user-create-name" name="name" label="Name" required autoComplete="name" />
          <Input id="user-create-email" name="email" type="email" label="Email" required autoComplete="off" />
          <Input id="user-create-password" name="password" type="password" label="Password" hint="At least 6 characters." required minLength={6} autoComplete="new-password" />
          <Select id="user-create-role" name="role" label="Role" defaultValue="user" options={roles} />
        </CategorySection>
        <CategoryDialogActions onCancel={close} submitLabel="Add user" saving={saving} />
      </form>
    </Modal>
  );
}
