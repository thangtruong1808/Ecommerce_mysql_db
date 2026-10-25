import type { DecimalValue, DiscountType, SqlBoolean } from "./common";

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  name?: string;
  price?: DecimalValue;
  image_url?: string | null;
  stock?: number;
}

export interface Cart {
  id: number;
  user_id: number | null;
  created_at?: string;
  updated_at?: string;
  items?: CartItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  image_url: string | null;
  price: DecimalValue;
  quantity: number;
  created_at?: string;
}

export interface ShippingAddress {
  id?: number;
  order_id?: number;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  created_at?: string;
}

export interface Order {
  id: number;
  order_number: string | null;
  user_id: number;
  voucher_id: number | null;
  voucher_discount: DecimalValue;
  payment_method: string;
  payment_result_id: string | null;
  payment_status: string | null;
  payment_update_time: string | null;
  payment_email: string | null;
  tax_price: DecimalValue;
  shipping_price: DecimalValue;
  total_price: DecimalValue;
  is_paid: SqlBoolean;
  paid_at: string | null;
  is_delivered: SqlBoolean;
  delivered_at: string | null;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
  items?: OrderItem[];
  shipping_address?: ShippingAddress;
}

export interface Voucher {
  id: number;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: DecimalValue;
  min_purchase_amount: DecimalValue;
  max_discount_amount: DecimalValue | null;
  start_date: string;
  end_date: string;
  usage_limit_per_user: number;
  total_usage_limit: number | null;
  current_usage_count: number;
  is_active: SqlBoolean;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  order_id: number;
  user_id: number;
  subtotal: DecimalValue;
  tax_amount: DecimalValue;
  shipping_amount: DecimalValue;
  total_amount: DecimalValue;
  payment_method: string;
  payment_status: string;
  billing_address: string;
  shipping_address: string;
  email_sent: SqlBoolean;
  email_sent_at: string | null;
  pdf_path: string | null;
  created_at?: string;
}

export interface ShippingQuoteRequest {
  subtotal: number;
  destinationPostcode: string;
  destinationCountry?: string;
}

export interface ShippingQuote {
  amount: number;
  service: string;
  source: "fallback" | "auspost_pac";
  estimated_days: string;
}

export interface StripeConfig {
  publishableKey: string;
}
