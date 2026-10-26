import { Badge, Button, Modal } from "../ui";
import { CategorySection } from "./categoryDialogChrome";
import { money } from "../../pages/admin/dashboardFormat";
import type { AdminCart, AdminCartItem } from "./CartTableRow";

interface CartViewModalProps {
  cart: AdminCart | null;
  isOpen: boolean;
  onClose: () => void;
}

function lineTotal(item: AdminCartItem): number {
  const price = Number(item.price);
  const quantity = Number(item.quantity);
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    return 0;
  }
  return price * quantity;
}

export default function CartViewModal({ cart, isOpen, onClose }: CartViewModalProps) {
  if (!cart) {
    return null;
  }
  const items = Array.isArray(cart.items) ? cart.items : [];
  const guest = !cart.user_id;
  const userLabel = cart.user_name || cart.user_email || `User #${cart.user_id}`;

  return (
    <Modal open={isOpen} title="Cart details" onClose={onClose} className="max-w-2xl">
      <div className="space-y-4">
        <CategorySection title="Cart">
          <dl className="grid gap-3 font-ui text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-ink">Cart ID</dt>
              <dd className="text-muted">{cart.id}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">User</dt>
              <dd className="mt-1">{guest ? <Badge variant="neutral">Guest</Badge> : <span className="font-semibold text-primary">{userLabel}</span>}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Items</dt>
              <dd className="text-muted">{items.length}</dd>
            </div>
          </dl>
        </CategorySection>
        <CategorySection title="Items">
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex min-w-0 items-center justify-between gap-3 rounded-ui bg-surface px-3 py-3">
                  <div className="min-w-0">
                    <div className="font-ui text-sm font-semibold text-ink">{item.product_name || `Product #${item.product_id ?? ""}`}</div>
                    <div className="font-ui text-sm text-muted">Qty: {Number(item.quantity) || 0}</div>
                  </div>
                  <div className="shrink-0 text-right font-ui text-sm tabular-nums">
                    <div className="text-ink">{money(item.price)}</div>
                    <div className="font-semibold text-ink">{money(lineTotal(item))}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-ui text-sm text-muted">This cart has no items.</p>
          )}
        </CategorySection>
        <div className="sticky bottom-0 z-10 -mx-5 flex justify-end border-t border-line bg-surface px-5 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0 sm:py-0">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
