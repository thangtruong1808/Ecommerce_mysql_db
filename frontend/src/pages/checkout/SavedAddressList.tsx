import type { UserAddress } from "@shared/auth";
import { Badge } from "../../components/ui";
import { isDefaultAddress } from "./checkoutModel";

interface SavedAddressListProps {
  addresses: UserAddress[];
  selectedAddressId: number | null;
  useNewAddress: boolean;
  disabled: boolean;
  onSelect: (addressId: number | null) => void;
}

export function SavedAddressList({
  addresses,
  selectedAddressId,
  useNewAddress,
  disabled,
  onSelect,
}: SavedAddressListProps) {
  if (addresses.length === 0) return null;

  return (
    <fieldset className="mb-6 space-y-3">
      <legend className="mb-3 text-sm font-medium text-ink">Select a saved address</legend>
      {addresses.map((address) => {
        const selected = selectedAddressId === address.id && !useNewAddress;
        return (
          <label
            key={address.id}
            className={`flex cursor-pointer items-start gap-3 rounded-ui-sm border p-4 ${
              selected ? "border-primary bg-primary/10" : "border-line bg-surface"
            }`}
          >
            <input
              type="radio"
              name="addressSelect"
              className="mt-1"
              checked={selected}
              disabled={disabled}
              onChange={() => onSelect(address.id)}
            />
            <span>
              <span className="flex flex-wrap items-center gap-2 font-medium text-ink">
                {address.address}
                {isDefaultAddress(address) ? <Badge variant="primary">Default</Badge> : null}
              </span>
              <span className="mt-1 block text-sm text-muted">
                {address.city}, {address.postal_code}, {address.country}
              </span>
            </span>
          </label>
        );
      })}
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-ui-sm border p-4 ${
          useNewAddress ? "border-primary bg-primary/10" : "border-line bg-surface"
        }`}
      >
        <input
          type="radio"
          name="addressSelect"
          checked={useNewAddress}
          disabled={disabled}
          onChange={() => onSelect(null)}
        />
        <span className="font-medium text-ink">Use a new address</span>
      </label>
    </fieldset>
  );
}
