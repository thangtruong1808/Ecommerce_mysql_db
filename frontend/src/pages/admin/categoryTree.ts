export interface CategoryRecord {
  id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SubcategoryRecord extends CategoryRecord {
  category_id: number;
  category_name?: string | null;
}

export interface ChildCategoryRecord {
  id: number;
  name: string;
  description: string | null;
  subcategory_id: number;
  subcategory_name?: string | null;
  category_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ParentOption {
  id: number;
  name: string;
  category_name?: string | null;
}

export function photoSrc(url: string | null | undefined): string {
  if (!url) {
    return "";
  }
  return url.startsWith("http") ? url : `${window.location.origin}${url}`;
}

export function readPreview(file: File, setPreview: (value: string) => void) {
  const reader = new FileReader();
  reader.onloadend = () => {
    if (typeof reader.result === "string") {
      setPreview(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

export function asParents(data: unknown): ParentOption[] | null {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.filter((item): item is ParentOption => {
    return Boolean(item) && typeof item === "object" && typeof (item as ParentOption).id === "number";
  });
}
