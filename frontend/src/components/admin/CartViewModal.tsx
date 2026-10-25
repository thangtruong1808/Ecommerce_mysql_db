import { Button, Modal } from "../ui";
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
  const userLabel = cart.user_id
    ? cart.user_name || cart.user_email || `User #${cart.user_id}`
    : "Guest";

  return (
    <Modal open={isOpen} title="Cart Details" onClose={onClose} className="max-w-2xl">
      <div className="space-y-4">
        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-medium">Cart ID</dt>
            <dd>{cart.id}</dd>
          </div>
          <div>
            <dt className="font-medium">User</dt>
            <dd>{userLabel}</dd>
          </div>
          <div>
            <dt className="font-medium">Items</dt>
            <dd>{items.length}</dd>
          </div>
        </dl>
        {items.length > 0 ? (
          <div className="border-t border-line pt-4">
            <h3 className="mb-2 font-medium">Cart Items</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 border-b border-line pb-2">
                  <div>
                    <div className="font-medium">{item.product_name || `Product #${item.product_id ?? ""}`}</div>
                    <div className="text-sm text-muted">Qty: {Number(item.quantity) || 0}</div>
                  </div>
                  <div className="text-right">
                    <div>{money(item.price)}</div>
                    <div className="text-sm text-muted">{money(lineTotal(item))}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted">This cart has no items.</p>
        )}
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
