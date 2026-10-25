import { controlClass } from "../ui/styles";

interface CategoryPhotoFieldProps {
  id: string;
  preview: string | null;
  previewAlt: string;
  hint: string;
  deleting?: boolean;
  canDelete?: boolean;
  onFile: (file: File) => void;
  onDelete?: () => void;
}

export default function CategoryPhotoField({
  id,
  preview,
  previewAlt,
  hint,
  deleting = false,
  canDelete = false,
  onFile,
  onDelete,
}: CategoryPhotoFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-ui text-sm font-semibold text-ink">
        Photo
      </label>
      {preview ? (
        <div className="relative mb-2 inline-block">
          <img src={preview} alt={previewAlt} className="h-24 w-24 rounded-ui border border-line object-cover" />
          {canDelete && onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              aria-busy={deleting || undefined}
              aria-label="Delete photo"
              className="absolute right-0 top-0 rounded-full bg-danger p-1 text-on-danger hover:bg-danger-hover disabled:opacity-60"
            >
              {deleting ? (
                <span className="block h-3 w-3 rounded-full border-2 border-on-danger border-t-transparent motion-safe:animate-spin" />
              ) : (
                <span aria-hidden="true">×</span>
              )}
            </button>
          ) : null}
        </div>
      ) : null}
      <input
        id={id}
        type="file"
        accept="image/*"
        className={controlClass()}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
        }}
      />
      <p className="mt-1 font-ui text-xs text-muted">{hint}</p>
    </div>
  );
}
