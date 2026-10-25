import type { DecimalValue, DiscountType, SqlBoolean } from "./common";

export interface Category {
  id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChildCategory {
  id: number;
  subcategory_id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: DecimalValue;
  child_category_id: number;
  stock: number;
  rating: DecimalValue;
  num_reviews: number;
  discount_type: DiscountType | null;
  discount_value: DecimalValue | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  is_on_clearance: SqlBoolean;
  created_at?: string;
  updated_at?: string;
  images?: ProductImage[];
  videos?: ProductVideo[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string | null;
  is_primary: SqlBoolean;
  created_at?: string;
}

export interface ProductVideo {
  id: number;
  product_id: number;
  video_url: string | null;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  is_primary: SqlBoolean;
  created_at?: string;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: number | string;
  subcategory?: number | string;
  childCategory?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sort?: string;
}
