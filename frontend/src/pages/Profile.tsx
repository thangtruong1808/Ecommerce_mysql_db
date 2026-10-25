import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import type { User, UserAddress } from "@shared/auth";
import AddressForm from "../components/AddressForm";
import PasswordField from "../components/auth/PasswordField";
import { Badge, Button, Card, EmptyState, Modal, Skeleton } from "../components/ui";
import { Field } from "../components/ui/Field";
import { controlClass } from "../components/ui/styles";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

interface ProfileFields {
  name: string;
  email: string;
}

interface PasswordFields {
  newPassword: string;
  confirmPassword: string;
}

interface AddressFields {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { msg?: string }[] } | undefined;
    return data?.errors?.[0]?.msg || data?.message || fallback;
  }
  return fallback;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "Not available";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Not available";
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

function asAddresses(data: unknown): UserAddress[] | null {
  if (!Array.isArray(data)) return null;
  return data.filter((item): item is UserAddress => {
    if (!item || typeof item !== "object") return false;
    const row = item as Partial<UserAddress>;
    return typeof row.id === "number" && typeof row.address === "string";
  });
}

function isDefaultAddress(value: UserAddress["is_default"]): boolean {
  return value === true || value === 1;
}

function Profile() {
  usePageTitle("My Profile");
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<UserAddress | null>(null);
  const [deleting, setDeleting] = useState(false);

  const profileForm = useForm<ProfileFields>();
  const passwordForm = useForm<PasswordFields>();
  const addressForm = useForm<AddressFields>();
  const { reset: resetProfile } = profileForm;
  const newPassword = passwordForm.watch("newPassword");

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      const response = await axios.get<User>("/api/auth/profile");
      setProfile(response.data);
      resetProfile({ name: response.data.name || "", email: response.data.email || "" });
    } catch (error) {
      setProfileError(messageFrom(error, "Could not load your profile."));
    } finally {
      setProfileLoading(false);
    }
  }, [resetProfile]);

  const loadAddresses = useCallback(async () => {
    setAddressLoading(true);
    setAddressError("");
    try {
      const response = await axios.get<unknown>("/api/auth/addresses");
      const list = asAddresses(response.data);
      if (!list) {
        setAddressError("Could not read your saved addresses.");
        return;
      }
      setAddresses(list);
    } catch (error) {
      setAddressError(messageFrom(error, "Could not load your addresses."));
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
    void loadAddresses();
  }, [loadProfile, loadAddresses]);

  const shown = profile || user;
  const role = shown?.role || "user";

  const onSaveProfile = profileForm.handleSubmit(async (data) => {
    setSavingProfile(true);
    try {
      const result = await updateProfile({ name: data.name, email: data.email });
      if (!result.success) {
        toast.error(result.error || "Update failed");
        return;
      }
      toast.success("Profile updated successfully!");
      setEditing(false);
      await loadProfile();
    } finally {
      setSavingProfile(false);
    }
  });

  const onSavePassword = passwordForm.handleSubmit(async (data) => {
    setSavingPassword(true);
    try {
      const result = await updateProfile({ password: data.newPassword });
      if (!result.success) {
        toast.error(result.error || "Password change failed");
        return;
      }
      toast.success("Password changed successfully!");
      setChangingPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      passwordForm.reset({ newPassword: "", confirmPassword: "" });
    } finally {
      setSavingPassword(false);
    }
  });

  const onSaveAddress = addressForm.handleSubmit(async (data) => {
    setSavingAddress(true);
    const body = {
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
      country: data.country,
      is_default: data.isDefault || false,
    };
    try {
      if (editingAddress) {
        await axios.put(`/api/auth/addresses/${editingAddress.id}`, body);
        toast.success("Address updated successfully!");
      } else {
        await axios.post("/api/auth/addresses", body);
        toast.success("Address added successfully!");
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      addressForm.reset({ address: "", city: "", postalCode: "", country: "", isDefault: false });
      await loadAddresses();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to save address"));
    } finally {
      setSavingAddress(false);
    }
  });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/auth/addresses/${pendingDelete.id}`);
      toast.success("Address deleted successfully!");
      setPendingDelete(null);
      await loadAddresses();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to delete address"));
    } finally {
      setDeleting(false);
    }
  };

  const startNewAddress = () => {
    setEditingAddress(null);
    addressForm.reset({ address: "", city: "", postalCode: "", country: "", isDefault: false });
    setShowAddressForm(true);
  };

  const startEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    addressForm.reset({
      address: address.address,
      city: address.city,
      postalCode: address.postal_code,
      country: address.country,
      isDefault: isDefaultAddress(address.is_default),
    });
    setShowAddressForm(true);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <h1 className="font-display text-4xl text-ink">My profile</h1>
        <p className="mt-2 font-ui text-sm text-muted">Manage your account information and shipping addresses.</p>
      </header>

      <Card
        title="Profile information"
        actions={
          !editing && !profileLoading ? (
            <Button type="button" size="sm" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          ) : null
        }
      >
        {profileLoading ? (
          <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : editing ? (
          <form className="space-y-4" onSubmit={onSaveProfile} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="profile-name" label="Full name" error={profileForm.formState.errors.name?.message}>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  disabled={savingProfile}
                  className={controlClass(Boolean(profileForm.formState.errors.name))}
                  aria-invalid={profileForm.formState.errors.name ? true : undefined}
                  {...profileForm.register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                    maxLength: { value: 100, message: "Name must be less than 100 characters" },
                  })}
                />
              </Field>
              <Field id="profile-email" label="Email address" error={profileForm.formState.errors.email?.message}>
                <input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  disabled={savingProfile}
                  className={controlClass(Boolean(profileForm.formState.errors.email))}
                  aria-invalid={profileForm.formState.errors.email ? true : undefined}
                  {...profileForm.register("email", {
                    required: "Email is required",
                    pattern: { value: emailPattern, message: "Invalid email address" },
                  })}
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <Button type="submit" loading={savingProfile}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={savingProfile}
                onClick={() => {
                  setEditing(false);
                  profileForm.reset({ name: shown?.name || "", email: shown?.email || "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-ui bg-canvas px-4 py-3">
              <dt className="font-ui text-sm text-muted">Full name</dt>
              <dd className="mt-1 font-ui text-lg text-ink">{shown?.name || "Not available"}</dd>
            </div>
            <div className="rounded-ui bg-canvas px-4 py-3">
              <dt className="font-ui text-sm text-muted">Email address</dt>
              <dd className="mt-1 break-words font-ui text-lg text-ink">{shown?.email || "Not available"}</dd>
            </div>
            <div className="rounded-ui bg-canvas px-4 py-3">
              <dt className="font-ui text-sm text-muted">Account role</dt>
              <dd className="mt-1">
                <Badge variant={role === "admin" ? "primary" : "neutral"}>{role}</Badge>
              </dd>
            </div>
            <div className="rounded-ui bg-canvas px-4 py-3">
              <dt className="font-ui text-sm text-muted">Member since</dt>
              <dd className="mt-1 font-ui text-lg text-ink">{formatDate(profile?.created_at)}</dd>
            </div>
          </dl>
        )}
        {profileError && !editing ? (
          <div className="mt-4 space-y-3" role="alert">
            <p className="text-sm text-danger">{profileError}</p>
            <Button type="button" variant="outline" onClick={() => void loadProfile()}>
              Try again
            </Button>
          </div>
        ) : null}
      </Card>

      <Card
        title="Shipping addresses"
        actions={
          !showAddressForm && !addressLoading ? (
            <Button type="button" size="sm" onClick={startNewAddress}>
              Add address
            </Button>
          ) : null
        }
      >
        {addressLoading ? (
          <div className="space-y-3" aria-hidden="true">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : addressError ? (
          <div className="space-y-3" role="alert">
            <p className="text-sm text-danger">{addressError}</p>
            <Button type="button" variant="outline" onClick={() => void loadAddresses()}>
              Try again
            </Button>
          </div>
        ) : showAddressForm ? (
          <form className="space-y-4" onSubmit={onSaveAddress} noValidate>
            <AddressForm
              register={addressForm.register}
              errors={addressForm.formState.errors}
              disabled={savingAddress}
            />
            <label className="flex items-center gap-2 rounded-ui bg-canvas px-4 py-3 font-ui text-sm text-ink" htmlFor="address-default">
              <input
                id="address-default"
                type="checkbox"
                className="h-4 w-4 accent-primary"
                disabled={savingAddress}
                {...addressForm.register("isDefault")}
              />
              Set as default address
            </label>
            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <Button type="submit" loading={savingAddress}>
                {editingAddress ? "Update address" : "Add address"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={savingAddress}
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  addressForm.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : addresses.length === 0 ? (
          <EmptyState
            title="No saved addresses"
            description="Add an address to use it at checkout."
            action={
              <Button type="button" onClick={startNewAddress}>
                Add address
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {addresses.map((address) => {
              const isDefault = isDefaultAddress(address.is_default);
              return (
              <li
                key={address.id}
                className={`flex min-w-0 flex-col gap-3 rounded-ui-lg border p-4 sm:flex-row sm:items-start sm:justify-between ${
                  isDefault ? "border-primary bg-canvas" : "border-line bg-canvas"
                }`}
              >
                <div className="min-w-0">
                  {isDefault ? <Badge variant="primary">Default address</Badge> : null}
                  <p className={`break-words font-ui font-semibold text-ink ${isDefault ? "mt-2" : ""}`}>{address.address}</p>
                  <p className="break-words font-ui text-sm text-muted">
                    {address.city}, {address.postal_code}
                  </p>
                  <p className="break-words font-ui text-sm text-muted">{address.country}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => startEditAddress(address)}>
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => setPendingDelete(address)}>
                    Delete
                  </Button>
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card
        title="Change password"
        actions={
          !changingPassword ? (
            <Button type="button" size="sm" variant="outline" onClick={() => setChangingPassword(true)}>
              Change password
            </Button>
          ) : null
        }
      >
        {changingPassword ? (
          <form className="space-y-4" onSubmit={onSavePassword} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                id="profile-new-password"
                label="New password"
                autoComplete="new-password"
                shown={showNewPassword}
                disabled={savingPassword}
                error={passwordForm.formState.errors.newPassword?.message}
                onToggle={() => setShowNewPassword((value) => !value)}
                {...passwordForm.register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <PasswordField
                id="profile-confirm-password"
                label="Confirm new password"
                autoComplete="new-password"
                shown={showConfirmPassword}
                disabled={savingPassword}
                error={passwordForm.formState.errors.confirmPassword?.message}
                onToggle={() => setShowConfirmPassword((value) => !value)}
                {...passwordForm.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === newPassword || "Passwords do not match",
                })}
              />
            </div>
            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <Button type="submit" loading={savingPassword}>
                Update password
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={savingPassword}
                onClick={() => {
                  setChangingPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                  passwordForm.reset({ newPassword: "", confirmPassword: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="font-ui text-sm text-muted">Your password stays hidden. Choose a new one when you want to change it.</p>
        )}
      </Card>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this address?"
        description={pendingDelete ? pendingDelete.address : undefined}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={deleting} onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={deleting} onClick={() => void confirmDelete()}>
            Delete address
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
