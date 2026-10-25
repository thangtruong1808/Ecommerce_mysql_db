import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import comingSoon from "../assets/images/image_comming_soon.png";
import { Button, EmptyState, Skeleton } from "../components/ui";
import { useCart, type CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

function money(value: number | string | null | undefined): string {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

function stockOf(item: CartItem): number {
  const stock = Number(item.stock);
  return Number.isFinite(stock) ? stock : 0;
}

function Cart() {
  usePageTitle("Shopping Cart");
  const { cart, loading, loadError, updateQuantity, removeFromCart, getTotals, getItemCount, refreshCart } = useCart();
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const navigate = useNavigate();
  const [busy, setBusy] = useState<Record<number, "quantity" | "remove" | undefined>>({});

  const totals = getTotals();
  const itemCount = getItemCount();

  const changeQuantity = async (item: CartItem, next: number) => {
    if (next < 1 || busy[item.cart_item_id]) {
      return;
    }
    setBusy((current) => ({ ...current, [item.cart_item_id]: "quantity" }));
    try {
      const result = await updateQuantity(item.cart_item_id, next);
      if (result.success) {
        toast.success("Cart updated");
      } else {
        toast.error(result.error || "Failed to update quantity");
      }
    } finally {
      setBusy((current) => ({ ...current, [item.cart_item_id]: undefined }));
    }
  };

  const removeItem = async (itemId: number) => {
    if (busy[itemId]) {
      return;
    }
    setBusy((current) => ({ ...current, [itemId]: "remove" }));
    try {
      const result = await removeFromCart(itemId);
      if (result.success) {
        toast.success("Item removed from cart");
      } else {
        toast.error(result.error || "Failed to remove item");
      }
    } finally {
      setBusy((current) => ({ ...current, [itemId]: undefined }));
    }
  };

  const checkout = () => {
    navigate(isAuthenticated ? "/checkout" : "/login");
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-4xl text-ink">Shopping cart</h1>
        <div className="space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <p className="sr-only">Loading cart</p>
        </div>
      </div>
    );
  }

  if (loadError && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-4xl text-ink">Shopping cart</h1>
        <EmptyState
          title="Cart could not be loaded"
          description={loadError}
          action={
            <Button type="button" onClick={() => void refreshCart()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-4xl text-ink">Shopping cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Add some products to get started."
          action={
            <Link
              to="/products"
              className="inline-flex h-12 items-center justify-center rounded-ui bg-primary px-5 font-ui text-sm font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-4xl text-ink">
        Shopping cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h1>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {cart.items.map((item) => {
            const stock = stockOf(item);
            const rowBusy = busy[item.cart_item_id];
            return (
              <article key={item.cart_item_id} className="flex min-w-0 flex-wrap items-center gap-3 rounded-ui-lg border border-line bg-surface p-4 shadow-ui">
                <Link
                  to={`/products/${item.product_id}`}
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-ui border border-line bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-24 sm:w-24"
                >
                  <img
                    src={item.image_url || comingSoon}
                    alt=""
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      if (event.currentTarget.dataset.fallback === "1") {
                        return;
                      }
                      event.currentTarget.dataset.fallback = "1";
                      event.currentTarget.src = comingSoon;
                    }}
                  />
                  <span className="sr-only">{item.name || "Product"}</span>
                </Link>
                <div className="min-w-0 flex-1 basis-40">
                  <h2 className="font-ui text-base font-semibold text-ink">
                    <Link to={`/products/${item.product_id}`} className="rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      {item.name || "Product"}
                    </Link>
                  </h2>
                  <p className="font-ui text-sm font-semibold text-secondary">{money(item.price)}</p>
                  <p className={`font-ui text-sm font-semibold ${stock > 0 ? "text-success" : "text-danger"}`}>
                    {stock > 0 ? `In stock (${stock} available)` : "Out of stock"}
                  </p>
                </div>
                <div className="flex items-center gap-2" aria-busy={rowBusy === "quantity"}>
                  <button
                    type="button"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-ui border border-line bg-canvas font-ui text-lg text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                    aria-label={`Decrease quantity of ${item.name || "product"}`}
                    disabled={item.quantity <= 1 || Boolean(rowBusy)}
                    onClick={() => void changeQuantity(item, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="inline-flex h-12 w-12 items-center justify-center font-ui text-ink" aria-live="polite">
                    {rowBusy === "quantity" ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary" />
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <button
                    type="button"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-ui border border-line bg-canvas font-ui text-lg text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                    aria-label={`Increase quantity of ${item.name || "product"}`}
                    disabled={item.quantity >= stock || Boolean(rowBusy)}
                    onClick={() => void changeQuantity(item, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="min-w-0 text-left sm:ml-auto sm:text-right">
                  <p className="font-ui text-lg font-semibold text-secondary">{money((Number(item.price) || 0) * item.quantity)}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-danger"
                    loading={rowBusy === "remove"}
                    disabled={rowBusy === "quantity"}
                    onClick={() => void removeItem(item.cart_item_id)}
                  >
                    Remove
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="h-fit min-w-0 rounded-ui-lg border border-line bg-surface p-5 shadow-ui sm:p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 font-ui text-lg font-semibold text-ink">Order summary</h2>
          <dl className="mb-4 space-y-2 font-ui text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">{money(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Tax</dt>
              <dd className="text-ink">{money(totals.tax)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-ink">{money(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-line pt-3 font-ui text-lg font-semibold">
              <dt className="text-ink">Total</dt>
              <dd className="text-secondary">{money(totals.total)}</dd>
            </div>
          </dl>
          {totals.subtotal < 100 ? (
            <p className="mb-4 rounded-ui border border-line bg-canvas p-4 text-center text-sm text-ink">
              Add {money(100 - totals.subtotal)} more to qualify for free shipping on orders over $100.
            </p>
          ) : null}
          {isAuthenticated ? (
            <Button type="button" className="w-full" onClick={checkout}>
              Proceed to checkout
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="rounded-ui border border-line bg-canvas p-4 text-center text-sm text-muted">
                To complete your purchase, please sign in to your account. You can create an account from the login page.
              </p>
              <Button type="button" className="w-full" onClick={checkout}>
                Login to checkout
              </Button>
            </div>
          )}
          <Link
            to="/products"
            className="mt-4 block rounded-ui text-center font-ui text-sm font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
