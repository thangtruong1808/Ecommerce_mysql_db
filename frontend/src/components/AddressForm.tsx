import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Field } from "./ui/Field";
import { controlClass } from "./ui/styles";

type AddressName = "address" | "city" | "postalCode" | "country";

interface AddressFormProps {
  register: (
    name: AddressName,
    options?: { required?: string },
  ) => UseFormRegisterReturn;
  errors: Partial<Record<AddressName, FieldError>>;
  disabled?: boolean;
}

const fields: { name: AddressName; id: string; label: string; placeholder: string; required: string }[] = [
  { name: "address", id: "shipping-address", label: "Address", placeholder: "Street address", required: "Address is required" },
  { name: "city", id: "shipping-city", label: "City", placeholder: "City", required: "City is required" },
  { name: "postalCode", id: "shipping-postal", label: "Postal code", placeholder: "Postal code", required: "Postal code is required" },
  { name: "country", id: "shipping-country", label: "Country", placeholder: "Country", required: "Country is required" },
];

function AddressForm({ register, errors, disabled = false }: AddressFormProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const message = errors[field.name]?.message;
        return (
          <Field key={field.name} id={field.id} label={field.label} error={message}>
            <input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              disabled={disabled}
              className={controlClass(Boolean(message))}
              aria-invalid={message ? true : undefined}
              {...register(field.name, { required: field.required })}
            />
          </Field>
        );
      })}
    </div>
  );
}

export default AddressForm;
