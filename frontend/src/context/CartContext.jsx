/**
 * Cart Context
 * Manages shopping cart state and provides cart functions
 * Supports both authenticated (backend) and unauthenticated (localStorage) users
 * @author Thang Truong
 * @date 2025-12-12
 */

import { createContext, useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

/**
 * Custom hook to use cart context
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

/**
 * Cart Provider Component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  // Configure axios to send cookies
  axios.defaults.withCredentials = true;

  /**
   * Fetch cart from server (works for both authenticated and guest users)
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchCart = async () => {
    // Prevent duplicate simultaneous requests
    if (fetchingRef.current) return;
    // Debounce: don't fetch if last fetch was less than 500ms ago
    const now = Date.now();
    if (now - lastFetchRef.current < 500) return;

    fetchingRef.current = true;
    lastFetchRef.current = now;
    try {
      setLoading(true);
      const response = await axios.get("/api/cart", { withCredentials: true });
      setCart(response.data);
    } catch (error) {
      // Handle 429 errors silently (rate limit)
      if (error.response?.status === 429) {
        // Silent fail for rate limit - don't show error
        return;
      }
      // Only show error for other failures, and only if cart is empty
      if (cart.items.length === 0) {
        const message = error.response?.data?.message || "Failed to load cart";
        toast.error(message);
      }
      setCart({ items: [] });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  /**
   * Transfer guest cart to user cart when user logs in
   * @author Thang Truong
   * @date 2025-12-12
   */
  const transferGuestCart = async () => {
    try {
      await axios.post("/api/cart/transfer", {}, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      // If transfer fails (including 429), just fetch user cart
      if (error.response?.status !== 429) {
        await fetchCart();
      }
    }
  };

  /**
   * Load cart when authenticated status changes
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    // Only fetch if authentication status is stable (not during initial load)
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        transferGuestCart();
      } else {
        fetchCart();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  /**
   * Add item to cart (works for both authenticated and guest users via backend)
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Result object
   * @author Thang Truong
   * @date 2025-12-12
   */
  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        "/api/cart",
        {
          product_id: productId,
          quantity: quantity,
        },
        { withCredentials: true }
      );
      await fetchCart();
      return { success: true };
    } catch (error) {
      // Handle 429 errors gracefully
      if (error.response?.status === 429) {
        return {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
        };
      }
      const message =
        error.response?.data?.message || "Failed to add item to cart";
      return { success: false, error: message };
    }
  };

  /**
   * Update cart item quantity (works for both authenticated and guest users)
   * @author Thang Truong
   * @date 2025-12-12
   */
  const updateQuantity = async (itemId, quantity) => {
    try {
      await axios.put(
        `/api/cart/${itemId}`,
        { quantity },
        { withCredentials: true }
      );
      await fetchCart();
      return { success: true };
    } catch (error) {
      if (error.response?.status === 429) {
        return {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update quantity",
      };
    }
  };

  /**
   * Remove item from cart (works for both authenticated and guest users)
   * @author Thang Truong
   * @date 2025-12-12
   */
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`, { withCredentials: true });
      await fetchCart();
      return { success: true };
    } catch (error) {
      if (error.response?.status === 429) {
        return {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || "Failed to remove item",
      };
    }
  };

  /**
   * Clear entire cart (works for both authenticated and guest users)
   * @author Thang Truong
   * @date 2025-12-12
   */
  const clearCart = async () => {
    try {
      await axios.delete("/api/cart", { withCredentials: true });
      await fetchCart();
      return { success: true };
    } catch (error) {
      if (error.response?.status === 429) {
        return {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || "Failed to clear cart",
      };
    }
  };

  /**
   * Calculate cart totals
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getTotals = () => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  /**
   * Get total items count
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getItemCount = () =>
    cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotals,
    getItemCount,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
