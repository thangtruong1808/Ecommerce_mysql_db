export interface ProductFormValues {
  name: string;
  description: string;
  category_id: string;
  subcategory_id: string;
  child_category_id: string;
  price: string;
  stock: string;
  discount_type?: string;
  discount_value?: string;
  discount_start_date?: string;
  discount_end_date?: string;
}

export interface NamedOption {
  id: number;
  name: string;
  subcategories?: NamedOption[];
  child_categories?: NamedOption[];
}

export function asOptions(data: unknown): NamedOption[] | null {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.filter((item): item is NamedOption => {
    return Boolean(item) && typeof item === "object" && typeof (item as NamedOption).id === "number";
  });
}

export function formatDateForInput(value: unknown): string {
  if (!value) {
    return "";
  }
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
}

export function prepareProductPayload(data: ProductFormValues) {
  const hasDiscount = Boolean(data.discount_type);
  return {
    ...data,
    discount_type: data.discount_type || null,
    discount_value: hasDiscount ? data.discount_value : null,
    discount_start_date: hasDiscount && data.discount_start_date
      ? new Date(data.discount_start_date).toISOString()
      : null,
    discount_end_date: hasDiscount && data.discount_end_date
      ? new Date(data.discount_end_date).toISOString()
      : null,
  };
}
