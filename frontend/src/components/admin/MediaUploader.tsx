import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { Button } from "../ui";
import { focusRing } from "../ui/styles";

interface PreviewFile {
  file: File;
  url: string;
}

interface MediaUploaderProps {
  onUpload: (files: File[]) => Promise<void> | void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

export default function MediaUploader({
  onUpload,
  accept = "image/*",
  maxSize = 5,
  maxFiles = 10,
  multiple = true,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const addFiles = (selected: FileList | File[]) => {
    const next: PreviewFile[] = [];
    Array.from(selected).forEach((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxSize}MB`);
        return;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    });
    if (next.length === 0) {
      return;
    }
    setFiles((current) => {
      const combined = multiple ? [...current, ...next] : next;
      const kept = combined.slice(0, multiple ? maxFiles : 1);
      combined.slice(kept.length).forEach((item) => URL.revokeObjectURL(item.url));
      return kept;
    });
  };

  const removeFile = (index: number) => {
    setFiles((current) => {
      const removed = current[index];
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const handleUpload = async () => {
    if (uploading || files.length === 0) {
      return;
    }
    setUploading(true);
    try {
      await onUpload(files.map((item) => item.file));
      files.forEach((item) => URL.revokeObjectURL(item.url));
      setFiles([]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          if (event.dataTransfer.files.length > 0) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={`rounded-ui border-2 border-dashed p-8 text-center ${
          dragActive ? "border-primary bg-primary/10" : "border-line bg-surface"
        }`}
      >
        <FaCloudUploadAlt className="mx-auto mb-4 text-4xl text-muted" aria-hidden="true" />
        <p className="mb-2 text-ink">Drag and drop files here, or choose them from this device.</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`font-medium text-primary hover:underline ${focusRing}`}
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-label="Choose files"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              addFiles(event.target.files);
              event.target.value = "";
            }
          }}
          className="hidden"
        />
        <p className="mt-2 text-sm text-muted">Max {maxSize}MB per file, up to {maxFiles} {maxFiles === 1 ? "file" : "files"}.</p>
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h3 className="font-medium text-ink">Selected files ({files.length})</h3>
            <Button type="button" onClick={handleUpload} loading={uploading} disabled={uploading}>
              Upload
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {files.map((item, index) => (
              <div key={`${item.file.name}-${item.file.lastModified}-${index}`} className="relative overflow-hidden rounded-ui border border-line bg-surface">
                {item.file.type.startsWith("image/") ? (
                  <img src={item.url} alt="" className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-surface-muted px-2 text-center text-sm text-muted">{item.file.name}</div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  aria-label={`Remove ${item.file.name}`}
                  className={`absolute right-1 top-1 rounded-full bg-danger p-1 text-on-danger hover:bg-danger-hover disabled:opacity-60 ${focusRing}`}
                >
                  <FaTimes className="text-xs" aria-hidden="true" />
                </button>
                <p className="truncate p-1 text-xs text-muted">{item.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
