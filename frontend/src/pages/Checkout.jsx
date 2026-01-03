/**
 * Checkout Page Component
 * Handles order placement with shipping address and mock payment
 *
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProtectedRoute from "../components/ProtectedRoute";
import AddressForm from "../components/AddressForm";
import VoucherForm from "../components/VoucherForm";
import Button from "../components/Button";
import { FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import usePageTitle from "../hooks/usePageTitle";
import PaymentCards from "../assets/images/payment-cards.jpg";

/**
 * Checkout component
 * @returns {JSX.Element} Checkout page
 */
const Checkout = () => {
  usePageTitle("Checkout");
  const { cart, getTotals, refreshCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [voucherCode, setVoucherCode] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const totals = getTotals();

  // Calculate totals with voucher discount
  const subtotal = totals.subtotal;
  const subtotalAfterDiscount = Math.max(0, subtotal - voucherDiscount);
  const tax = subtotalAfterDiscount * 0.1;
  const shipping = subtotalAfterDiscount > 100 ? 0 : 10;
  const finalTotal = subtotalAfterDiscount + tax + shipping;

  /**
   * Fetch user's saved addresses
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await axios.get("/api/auth/addresses");
        const addresses = response.data || [];
        setSavedAddresses(addresses);

        const defaultAddress = addresses.find((addr) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setUseNewAddress(false);
          populateAddressForm(defaultAddress);
        } else if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
          setUseNewAddress(false);
          populateAddressForm(addresses[0]);
        } else {
          setUseNewAddress(true);
        }
      } catch (error) {
        // If addresses can't be fetched, allow new address entry
        setUseNewAddress(true);
      }
    };
    fetchAddresses();
  }, [isAuthenticated, setValue]);

  /** Populate address form with selected address @param {Object} address - Address object @author Thang Truong @date 2025-12-12 */
  const populateAddressForm = (address) => {
    setValue("address", address.address || "");
    setValue("city", address.city || "");
    setValue("postalCode", address.postal_code || "");
    setValue("country", address.country || "");
  };

  /** Handle address selection @param {number|null} addressId - Selected address ID or null for new address @author Thang Truong @date 2025-12-12 */
  const handleAddressSelect = (addressId) => {
    if (addressId === null) {
      setUseNewAddress(true);
      setSelectedAddressId(null);
      setValue("address", "");
      setValue("city", "");
      setValue("postalCode", "");
      setValue("country", "");
    } else {
      setUseNewAddress(false);
      setSelectedAddressId(addressId);
      const address = savedAddresses.find((addr) => addr.id === addressId);
      if (address) populateAddressForm(address);
    }
  };

  /**
   * Redirect if cart is empty (but not after successful order placement)
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (cart.items.length === 0 && isAuthenticated && !orderPlaced) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cart.items.length, isAuthenticated, navigate, orderPlaced]);

  /** Handle order submission @param {Object} data - Form data (shipping address) @author Thang Truong @date 2025-12-12 */
  const handleOrderSubmit = async (data) => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      setProcessing(true);
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          image_url: item.image_url || "",
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: "Mock Payment",
        voucher_code: voucherCode,
      };
      const response = await axios.post("/api/orders", orderData);
      await axios.put(`/api/orders/${response.data.orderId}/pay`, {
        payment_result_id: `MOCK-${Date.now()}`,
        payment_status: "completed",
        payment_update_time: new Date().toISOString(),
        payment_email: user?.email || "",
      });
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
      await refreshCart();
      navigate(`/orders/${response.data.orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <div></div>
      </ProtectedRoute>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  /* Checkout page layout */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

            {/* Saved addresses selection */}
            {savedAddresses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Select a saved address
                </h3>
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAddressId === address.id && !useNewAddress
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressSelect"
                        checked={
                          selectedAddressId === address.id && !useNewAddress
                        }
                        onChange={() => handleAddressSelect(address.id)}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <FaMapMarkerAlt className="text-blue-600 mr-2" />
                          <span className="font-medium text-gray-900">
                            {address.address}
                            {address.is_default && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.postal_code},{" "}
                          {address.country}
                        </p>
                      </div>
                    </label>
                  ))}
                  <label
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                      useNewAddress
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressSelect"
                      checked={useNewAddress}
                      onChange={() => handleAddressSelect(null)}
                      className="mt-1 mr-3"
                    />
                    <span className="font-medium text-gray-900">
                      Use a new address
                    </span>
                  </label>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleOrderSubmit)}
              className="space-y-4"
            >
              {(useNewAddress || savedAddresses.length === 0) && (
                <AddressForm register={register} errors={errors} />
              )}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong> Mock Payment (No real payment
                  will be processed)
                </p>
              </div>
              <Button
                type="submit"
                loading={processing}
                icon={<FaCheck />}
                className="w-full py-3"
              >
                Place Order
              </Button>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            {/* Voucher form */}
            <div className="mb-4">
              <VoucherForm
                orderTotal={subtotal}
                onVoucherApplied={(voucher, discount) => {
                  setVoucherCode(voucher.code);
                  setVoucherDiscount(discount);
                }}
                onVoucherRemoved={() => {
                  setVoucherCode(null);
                  setVoucherDiscount(0);
                }}
              />
            </div>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    ${((Number(item.price) || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Voucher Discount</span>
                  <span>-${voucherDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="m-4 text-center text-sm text-gray-600">
              We accept all major payment cards.
            </div>
            {/* Payment icons */}
            <div className="mt-2 flex justify-center items-center gap-3 opacity-80">
              <img
                src={PaymentCards}
                alt="Payment Cards"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
