import { forwardRef, type InputHTMLAttributes } from "react";
import { Field } from "../ui/Field";
import { controlClass } from "../ui/styles";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  shown: boolean;
  onToggle: () => void;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { id, label, error, shown, onToggle, className, ...props },
  ref
) {
  return (
    <Field id={id} label={label} error={error}>
      <div className="relative">
        <input
          id={id}
          type={shown ? "text" : "password"}
          className={`${controlClass(Boolean(error))} pr-16 ${className || ""}`}
          aria-invalid={error ? true : undefined}
          {...props}
          ref={ref}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 rounded-ui-sm px-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-pressed={shown}
          aria-controls={id}
          onClick={onToggle}
        >
          {shown ? "Hide" : "Show"}
        </button>
      </div>
    </Field>
  );
});

export default PasswordField;
