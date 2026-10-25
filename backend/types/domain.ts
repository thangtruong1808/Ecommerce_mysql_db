import type { RowDataPacket } from "mysql2";
import type { User, UserAddress, UserAddressInput } from "../../shared/src/auth.js";
import type {
  Category,
  ChildCategory,
  Product,
  ProductImage,
  ProductVideo,
  Subcategory,
} from "../../shared/src/catalog.js";
import type {
  Cart,
  CartItem,
  Invoice,
  Order,
  OrderItem,
  ShippingAddress,
  Voucher,
} from "../../shared/src/commerce.js";
import type { Comment, Review } from "../../shared/src/engagement.js";
import type { DecimalValue, SqlBoolean } from "../../shared/src/common.js";

/** Query row: shared model fields, plus any extra selected column. */
export type DbRow<T> = T & RowDataPacket;

export interface CountRow extends RowDataPacket {
  total: number;
  count: number;
}

export interface ListQuery {
  page?: any;
  limit?: any;
  search?: any;
  sortBy?: any;
  sortOrder?: any;
  role?: any;
  category?: any;
  categoryId?: any;
  subcategory?: any;
  subcategoryId?: any;
  childCategory?: any;
  minPrice?: any;
  maxPrice?: any;
  minStock?: any;
  maxStock?: any;
  sort?: any;
  status?: any;
  userId?: any;
  productId?: any;
  sessionId?: any;
  period?: any;
  startDate?: any;
  endDate?: any;
  isPaid?: any;
  isDelivered?: any;
  isActive?: any;
  isApproved?: any;
  paymentStatus?: any;
  [key: string]: any;
}

/** Dynamic INSERT/UPDATE field bag. SQL still decides which keys are written. */
export interface FieldMap {
  [key: string]: any;
}

export type AddressInput = UserAddressInput;

export type UserRow = DbRow<User & { password?: string }>;
export type AddressRow = DbRow<UserAddress>;
export type CategoryRow = DbRow<Category>;
export type SubcategoryRow = DbRow<Subcategory & { category_name?: string; child_categories?: any }>;
export type ChildCategoryRow = DbRow<
  ChildCategory & {
    subcategory_name?: string;
    category_name?: string;
    category_id?: number;
  }
>;
export type ProductRow = DbRow<Product & { liked_at?: string | Date; category_name?: string }>;
export type ProductImageRow = DbRow<ProductImage>;
export type ProductVideoRow = DbRow<ProductVideo>;
export type CartRow = DbRow<Cart & { session_id?: string | null; item_count?: number }>;
export type CartItemRow = DbRow<CartItem>;
export type OrderRow = DbRow<
  Omit<Order, "created_at"> & {
    created_at: string | Date;
  }
>;
export type OrderItemRow = DbRow<OrderItem>;
export type ShippingAddressRow = DbRow<ShippingAddress>;
export type VoucherRow = DbRow<Voucher>;
export type ReviewRow = DbRow<Review>;
export type CommentRow = DbRow<Comment>;
export type InvoiceRow = DbRow<
  Omit<Invoice, "billing_address" | "shipping_address" | "created_at" | "email_sent_at"> & {
    billing_address: any;
    shipping_address: any;
    created_at?: string | Date;
    email_sent_at?: string | Date | null;
    order_number?: string | null;
    user_name?: string;
    user_email?: string;
  }
>;

export interface RefreshTokenRecord {
  id: number;
  user_id: number;
  token: string;
  expires_at: string | Date;
  created_at?: string | Date;
}
export type RefreshTokenRow = DbRow<RefreshTokenRecord>;

export interface PasswordResetRecord {
  id: number;
  user_id: number;
  token: string;
  expires_at: string | Date;
  used: SqlBoolean;
  email?: string;
  name?: string;
}
export type PasswordResetRow = DbRow<PasswordResetRecord>;

export interface ProductLikeRecord {
  id: number;
  product_id: number;
  user_id: number;
  created_at?: string | Date;
}
export type LikeRow = DbRow<ProductLikeRecord>;

export interface VoucherUsageRecord {
  id: number;
  voucher_id: number;
  user_id: number;
  order_id: number;
  used_at?: string | Date;
}
export type VoucherUsageRow = DbRow<VoucherUsageRecord>;

export interface ProductViewRecord {
  id: number;
  product_id: number;
  user_id: number | null;
  session_id: string | null;
  viewed_at?: string | Date;
  name?: string;
  price?: DecimalValue;
}
export type ProductViewRow = DbRow<ProductViewRecord>;
