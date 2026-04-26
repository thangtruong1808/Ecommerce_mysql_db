/**
 * Checkout Page Component
 * Handles order placement with shipping address and Stripe payment
 *
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProtectedRoute from "../components/ProtectedRoute";
import AddressForm from "../components/AddressForm";
import VoucherForm from "../components/VoucherForm";
import Button from "../components/Button";
import { FaCheck, FaLock, FaMapMarkerAlt, FaRegCreditCard } from "react-icons/fa";
import usePageTitle from "../hooks/usePageTitle";
import PaymentCards from "../assets/images/payment-cards.jpg";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111827",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#DC2626",
    },
  },
};

const CheckoutFormContent = () => {
  usePageTitle("Checkout");
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotals, refreshCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [shippingAmount, setShippingAmount] = useState(10);
  const [shippingSource, setShippingSource] = useState("fallback");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingService, setShippingService] = useState("Standard Shipping");
  const [shippingEta, setShippingEta] = useState("3-5 business days");
  const [cardState, setCardState] = useState({
    complete: false,
    empty: true,
    error: "",
  });
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
    watch,
  } = useForm();

  const totals = getTotals();
  const subtotal = totals.subtotal;
  const subtotalAfterDiscount = Math.max(0, subtotal - voucherDiscount);
  const tax = subtotalAfterDiscount * 0.1;
  const finalTotal = subtotalAfterDiscount + tax + shippingAmount;
  const postalCodeValue = watch("postalCode");
  const countryValue = watch("country");

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
        setUseNewAddress(true);
      }
    };
    fetchAddresses();
  }, [isAuthenticated, setValue]);

  const populateAddressForm = (address) => {
    setValue("address", address.address || "");
    setValue("city", address.city || "");
    setValue("postalCode", address.postal_code || "");
    setValue("country", address.country || "");
  };

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

  useEffect(() => {
    if (cart.items.length === 0 && isAuthenticated && !orderPlaced) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cart.items.length, isAuthenticated, navigate, orderPlaced]);

  useEffect(() => {
    const fallbackShipping = subtotalAfterDiscount > 100 ? 0 : 10;
    const destinationPostcode = String(postalCodeValue || "").trim();
    const destinationCountry = String(countryValue || "").trim();

    if (!destinationPostcode || !destinationCountry) {
      setShippingAmount(fallbackShipping);
      setShippingSource("fallback");
      setShippingService("Standard Shipping");
      setShippingEta("3-5 business days");
      return;
    }

    let isMounted = true;
    setShippingLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.post("/api/shipping/quote", {
          subtotal: subtotalAfterDiscount,
          destinationPostcode,
          destinationCountry,
        });
        if (!isMounted) return;
        setShippingAmount(Number(response.data?.amount) || 0);
        setShippingSource(response.data?.source || "fallback");
        setShippingService(response.data?.service || "Standard Shipping");
        setShippingEta(response.data?.estimated_days || "3-5 business days");
      } catch (error) {
        if (!isMounted) return;
        setShippingAmount(fallbackShipping);
        setShippingSource("fallback");
        setShippingService("Standard Shipping");
        setShippingEta("3-5 business days");
      } finally {
        if (isMounted) setShippingLoading(false);
      }
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [subtotalAfterDiscount, postalCodeValue, countryValue]);

  const handleOrderSubmit = async (data) => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Payment form is still loading. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card details are missing. Please check and try again.");
      return;
    }
    if (!cardState.complete) {
      const message = "Please complete your card details before placing order.";
      setPaymentError(message);
      toast.error(message);
      return;
    }

    try {
      setProcessing(true);
      setPaymentError("");
      setProcessingMessage("Creating your order...");

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
        paymentMethod: "Stripe",
        voucher_code: voucherCode,
      };

      const orderResponse = await axios.post("/api/orders", orderData);
      const orderId = orderResponse.data.orderId;

      setProcessingMessage("Preparing secure payment...");
      const intentResponse = await axios.post(`/api/orders/${orderId}/payment-intent`);
      const { clientSecret } = intentResponse.data;

      setProcessingMessage("Processing payment...");
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || "Customer",
            email: user?.email || "",
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message || "Payment failed");
      }

      if (!paymentResult.paymentIntent?.id) {
        throw new Error("Payment intent was not returned by Stripe");
      }

      setProcessingMessage("Finalizing your order...");
      await axios.put(`/api/orders/${orderId}/pay`, {
        payment_intent_id: paymentResult.paymentIntent.id,
      });

      setOrderPlaced(true);
      toast.success("Order placed successfully!");
      await refreshCart();
      navigate(`/orders/${orderId}`);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to place order";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

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
              aria-busy={processing}
            >
              {(useNewAddress || savedAddresses.length === 0) && (
                <AddressForm register={register} errors={errors} />
              )}

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-900 font-semibold flex items-center gap-2">
                      <FaRegCreditCard className="text-blue-600" />
                      Stripe Payment (Test Mode)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Your card details are securely encrypted by Stripe.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                    <FaLock className="text-[10px]" />
                    Secure
                  </span>
                </div>

                <div
                  className={`p-3 bg-white rounded border transition ${
                    cardState.error
                      ? "border-red-400 ring-2 ring-red-100"
                      : cardState.complete
                      ? "border-emerald-400 ring-2 ring-emerald-100"
                      : "border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                  }`}
                >
                  <CardElement
                    options={cardElementOptions}
                    onChange={(event) => {
                      setCardState({
                        complete: event.complete,
                        empty: event.empty,
                        error: event.error?.message || "",
                      });
                      if (event.error?.message) {
                        setPaymentError(event.error.message);
                      } else if (!processing) {
                        setPaymentError("");
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Test card: 4242 4242 4242 4242, any future expiry, any CVC, any ZIP.
                </p>
                {shippingSource === "auspost_pac" && (
                  <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded">
                    Shipping estimate is calculated from Australia Post PAC.
                  </p>
                )}

                {cardState.complete && !cardState.error && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
                    Card details look good. You can place your order.
                  </p>
                )}
              </div>

              {processing && (
                <div
                  className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2"
                  role="status"
                  aria-live="polite"
                >
                  <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></span>
                  <span>{processingMessage || "Processing payment..."}</span>
                </div>
              )}

              {paymentError && (
                <div
                  className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2"
                  aria-live="polite"
                >
                  {paymentError}
                </div>
              )}

              <Button
                type="submit"
                loading={processing}
                loadingText="Processing payment..."
                icon={<FaCheck />}
                className="w-full py-3"
                disabled={!stripe || !elements || processing || cardState.empty}
              >
                Place Order
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

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
                  className="flex justify-between text-sm gap-3"
                >
                  <span className="flex-1 break-words">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="shrink-0">
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
                <span className="inline-flex items-center gap-2">
                  {shippingLoading && (
                    <span
                      className="h-3.5 w-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
                      aria-label="Updating shipping"
                    ></span>
                  )}
                  <span>${shippingAmount.toFixed(2)}</span>
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  {shippingLoading && (
                    <span
                      className="h-3 w-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"
                      aria-label="Updating shipping details"
                    ></span>
                  )}
                  {shippingLoading ? "Updating shipping details..." : shippingService}
                </span>
                <span>{shippingEta}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="m-4 text-center text-sm text-gray-600">
              We accept all major payment cards.
            </div>
            <div className="mt-2 flex justify-center items-center gap-3 opacity-80">
              <img
                src={PaymentCards}
                alt="Payment Cards"
                className="w-full max-w-xs h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeConfigChecked, setStripeConfigChecked] = useState(false);
  const [stripeConfigError, setStripeConfigError] = useState("");

  useEffect(() => {
    const initStripe = async () => {
      const envPublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
      if (envPublishableKey) {
        setStripePromise(loadStripe(envPublishableKey));
        setStripeConfigChecked(true);
        return;
      }

      try {
        const response = await axios.get("/api/payments/config");
        setStripePromise(loadStripe(response.data.publishableKey));
      } catch (error) {
        setStripeConfigError(
          error.response?.data?.message || "Stripe publishable key is missing."
        );
      } finally {
        setStripeConfigChecked(true);
      }
    };

    initStripe();
  }, []);

  if (!stripeConfigChecked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></span>
          <span>Loading secure payment form...</span>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          {stripeConfigError ||
            "Stripe publishable key is missing. Please configure VITE_STRIPE_PUBLISHABLE_KEY or backend STRIPE_PUBLISHABLE_KEY."}
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  );
};

export default Checkout;
