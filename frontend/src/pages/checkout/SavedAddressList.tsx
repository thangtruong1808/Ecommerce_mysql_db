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
    <fieldset className="mb-4 space-y-3">
      <legend className="mb-3 font-ui text-sm font-semibold text-ink">Select a saved address</legend>
      {addresses.map((address) => {
        const selected = selectedAddressId === address.id && !useNewAddress;
        return (
          <label
            key={address.id}
            className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-ui-lg border p-4 ${
              selected ? "border-primary bg-canvas" : "border-line bg-canvas"
            }`}
          >
            <input
              type="radio"
              name="addressSelect"
              className="mt-1 accent-primary"
              checked={selected}
              disabled={disabled}
              onChange={() => onSelect(address.id)}
            />
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2 font-ui font-semibold text-ink">
                <span className="break-words">{address.address}</span>
                {isDefaultAddress(address) ? <Badge variant="primary">Default address</Badge> : null}
              </span>
              <span className="mt-1 block break-words font-ui text-sm text-muted">
                {address.city}, {address.postal_code}, {address.country}
              </span>
            </span>
          </label>
        );
      })}
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-ui-lg border p-4 ${
          useNewAddress ? "border-primary bg-canvas" : "border-line bg-canvas"
        }`}
      >
        <input
          type="radio"
          name="addressSelect"
          className="accent-primary"
          checked={useNewAddress}
          disabled={disabled}
          onChange={() => onSelect(null)}
        />
        <span className="font-ui font-semibold text-ink">Use a new address</span>
      </label>
    </fieldset>
  );
}
