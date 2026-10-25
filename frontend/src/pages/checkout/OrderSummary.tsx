import type { ShippingQuote } from "@shared/commerce";
import type { CartItem } from "../../context/CartContext";
import VoucherForm from "../../components/VoucherForm";
import { Card } from "../../components/ui";
import PaymentCards from "../../assets/images/payment-cards.jpg";
import { money } from "./checkoutModel";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  voucherDiscount: number;
  quote: ShippingQuote;
  shippingLoading: boolean;
  finalTotal: number;
  onVoucherApplied: (code: string | null, discount: number) => void;
  onVoucherRemoved: () => void;
}

export function OrderSummary({
  items,
  subtotal,
  tax,
  voucherDiscount,
  quote,
  shippingLoading,
  finalTotal,
  onVoucherApplied,
  onVoucherRemoved,
}: OrderSummaryProps) {
  return (
    <Card title="Order summary" className="h-fit lg:sticky lg:top-4">
      <VoucherForm
        orderTotal={subtotal}
        onVoucherApplied={(voucher, discount) => {
          onVoucherApplied(voucher.code, discount);
        }}
        onVoucherRemoved={onVoucherRemoved}
      />
      <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <li key={item.cart_item_id} className="flex justify-between gap-3 text-sm text-ink">
            <span className="break-words">
              {item.name} × {item.quantity}
            </span>
            <span className="shrink-0">{money((Number(item.price) || 0) * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        {voucherDiscount > 0 ? (
          <div className="flex justify-between text-success">
            <dt>Voucher discount</dt>
            <dd>-{money(voucherDiscount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted">Tax</dt>
          <dd>{money(tax)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="inline-flex items-center gap-2">
            {shippingLoading ? (
              <span
                className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent motion-safe:animate-spin"
                aria-label="Updating shipping"
              />
            ) : null}
            {money(quote.amount)}
          </dd>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <dt>{shippingLoading ? "Updating shipping..." : quote.service}</dt>
          <dd>{quote.estimated_days}</dd>
        </div>
        {quote.source === "auspost_pac" ? (
          <p className="text-xs text-primary">Shipping estimate is calculated from Australia Post.</p>
        ) : null}
        <div className="flex justify-between border-t border-line pt-2 text-lg font-bold text-ink">
          <dt>Total</dt>
          <dd>{money(finalTotal)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-center text-sm text-muted">We accept all major payment cards.</p>
      <img
        src={PaymentCards}
        alt="Visa, Mastercard, and American Express"
        className="mx-auto mt-2 h-auto w-full max-w-xs object-contain"
      />
    </Card>
  );
}
