import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

axios.defaults.withCredentials = true;

export interface CartItem {
  cart_item_id: number;
  product_id?: number;
  name?: string;
  price?: number | string;
  quantity: number;
  stock?: number | string | null;
  image_url?: string | null;
  rating?: number | string | null;
}

export interface CartState {
  cartId?: number;
  items: CartItem[];
}

export interface CartResult {
  success: boolean;
  error?: string;
}

interface CartContextValue {
  cart: CartState;
  loading: boolean;
  loadError: string | null;
  addToCart: (productId: number, quantity?: number) => Promise<CartResult>;
  updateQuantity: (itemId: number, quantity: number) => Promise<CartResult>;
  removeFromCart: (itemId: number) => Promise<CartResult>;
  clearCart: () => Promise<CartResult>;
  getTotals: () => { subtotal: number; tax: number; shipping: number; total: number };
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as Partial<CartItem>;
  return typeof item.cart_item_id === "number" && typeof item.quantity === "number";
}

function asCart(data: unknown): CartState | null {
  if (!data || typeof data !== "object" || !Array.isArray((data as { items?: unknown }).items)) {
    return null;
  }
  const record = data as { cartId?: number; items: unknown[] };
  return {
    cartId: typeof record.cartId === "number" ? record.cartId : undefined,
    items: record.items.filter(isCartItem),
  };
}

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [cart, setCart] = useState<CartState>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const itemsRef = useRef<CartItem[]>([]);
  itemsRef.current = cart.items;

  const fetchCart = useCallback(async (force = false) => {
    if (fetchingRef.current && !force) {
      return;
    }
    fetchingRef.current = true;
    setLoading(true);
    try {
      const response = await axios.get("/api/cart");
      const next = asCart(response.data);
      if (!next) {
        throw new Error("Cart could not be loaded.");
      }
      setCart(next);
      setLoadError(null);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : 0;
      const message = messageFrom(error, "Failed to load cart");
      if (itemsRef.current.length === 0) {
        setLoadError(message);
      } else if (status !== 429) {
        toast.error(message);
      }
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  const applyResponse = useCallback(async (data: unknown) => {
    const next = asCart(data);
    if (!next) {
      await fetchCart(true);
      return;
    }
    setCart(next);
    setLoadError(null);
  }, [fetchCart]);

  const transferGuestCart = useCallback(async () => {
    try {
      const response = await axios.post("/api/cart/transfer", {});
      await applyResponse(response.data);
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 429) {
        await fetchCart(true);
      }
    }
  }, [applyResponse, fetchCart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        void transferGuestCart();
      } else {
        void fetchCart(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchCart, isAuthenticated, transferGuestCart]);

  const addToCart = async (productId: number, quantity = 1): Promise<CartResult> => {
    try {
      const response = await axios.post("/api/cart", {
        product_id: productId,
        quantity,
      });
      await applyResponse(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: messageFrom(error, "Failed to add item to cart") };
    }
  };

  const updateQuantity = async (itemId: number, quantity: number): Promise<CartResult> => {
    try {
      const response = await axios.put(`/api/cart/${itemId}`, { quantity });
      await applyResponse(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: messageFrom(error, "Failed to update quantity") };
    }
  };

  const removeFromCart = async (itemId: number): Promise<CartResult> => {
    try {
      const response = await axios.delete(`/api/cart/${itemId}`);
      await applyResponse(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: messageFrom(error, "Failed to remove item") };
    }
  };

  const clearCart = async (): Promise<CartResult> => {
    try {
      const response = await axios.delete("/api/cart");
      await applyResponse(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: messageFrom(error, "Failed to clear cart") };
    }
  };

  const getTotals = () => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
      0,
    );
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;
    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const getItemCount = () => cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextValue = {
    cart,
    loading,
    loadError,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotals,
    getItemCount,
    refreshCart: () => fetchCart(true),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
