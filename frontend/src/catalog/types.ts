export interface CatalogImage {
  image_url?: string | null;
  is_primary?: boolean | number | null;
}

export interface CatalogProduct {
  id: number;
  name: string;
  price: number | string;
  stock?: number;
  rating?: number | string | null;
  num_reviews?: number;
  images?: CatalogImage[];
  has_discount?: boolean | number | null;
  discounted_price?: number | string | null;
  discount_type?: string | null;
  discount_value?: number | string | null;
  likes_count?: number;
  like_count?: number;
  total_likes?: number;
  num_likes?: number;
  comments_count?: number;
  comment_count?: number;
  total_comments?: number;
  num_comments?: number;
}

export interface CatalogChildCategory {
  id: number;
  name: string;
  subcategory_id?: number;
}

export interface CatalogSubcategory {
  id: number;
  name: string;
  category_id?: number;
  child_categories?: CatalogChildCategory[];
}

export interface CatalogCategory {
  id: number;
  name: string;
  subcategories?: CatalogSubcategory[];
}

export interface CatalogPagination {
  page: number;
  pages: number;
  total: number;
  limit?: number;
}

export interface CatalogFilters {
  search: string;
  category: string;
  subcategory: string;
  childCategory: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: string;
  page: number;
}

export function isCatalogProduct(value: unknown): value is CatalogProduct {
  if (!value || typeof value !== "object") {
    return false;
  }
  const product = value as Partial<CatalogProduct>;
  return typeof product.id === "number" && typeof product.name === "string";
}

export function asCategoryList(data: unknown): CatalogCategory[] | null {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.filter((item): item is CatalogCategory => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const category = item as Partial<CatalogCategory>;
    return typeof category.id === "number" && typeof category.name === "string";
  });
}

export function asNamedList<T extends { id: number; name: string }>(data: unknown): T[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item): item is T => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const row = item as Partial<T>;
    return typeof row.id === "number" && typeof row.name === "string";
  });
}
