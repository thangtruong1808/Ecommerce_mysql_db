export interface PostalAddress {
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface InvoiceLineItem {
  name?: string;
  price?: number | string;
  quantity: number;
}

export interface InvoiceDocument {
  id?: number | string;
  invoice_number: string;
  order_id?: number | string;
  order_number?: string | null;
  created_at?: string | Date;
  total_amount?: number | string;
  subtotal?: number | string;
  tax_amount?: number | string;
  shipping_amount?: number | string;
  payment_method?: string;
  payment_status?: string;
  billing_address?: string | PostalAddress;
  shipping_address?: string | PostalAddress;
  items?: InvoiceLineItem[];
}
