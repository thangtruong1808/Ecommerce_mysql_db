import type { ReactNode, TextareaHTMLAttributes } from "react";
import { Button } from "../ui";
import { Field } from "../ui/Field";
import { controlClass } from "../ui/styles";

export function CategorySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-ui-lg border border-line bg-canvas p-4">
      <h3 className="mb-4 font-ui text-sm font-semibold text-ink">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function CategoryTextarea({
  id,
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string }) {
  return (
    <Field id={id} label={label}>
      <textarea id={id} rows={3} className={controlClass()} {...props} />
    </Field>
  );
}

export function CategoryDialogActions({
  onCancel,
  submitLabel,
  saving,
  disabled = false,
}: {
  onCancel: () => void;
  submitLabel: string;
  saving: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 flex flex-col-reverse gap-3 border-t border-line bg-surface px-5 py-3 sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-0 sm:px-0 sm:py-0">
      <Button type="button" variant="outline" onClick={onCancel} disabled={saving || disabled}>
        Cancel
      </Button>
      <Button type="submit" loading={saving} disabled={disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}
