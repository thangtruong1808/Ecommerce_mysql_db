import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe, type StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import type { UserAddress } from "@shared/auth";
import AddressForm from "../components/AddressForm";
import { Badge, Button, Card, EmptyState, Skeleton } from "../components/ui";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";
import { useTheme } from "../theme/ThemeProvider";
import { OrderSummary } from "./checkout/OrderSummary";
import { SavedAddressList } from "./checkout/SavedAddressList";
import {
  addressValues,
  isDefaultAddress,
  messageFrom,
  useShippingQuote,
  type AddressFields,
} from "./checkout/checkoutModel";


interface CardState {
  complete: boolean;
  empty: boolean;
  error: string;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { resolved } = useTheme();
  const { cart, loading: cartLoading, loadError, getTotals, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [cardState, setCardState] = useState<CardState>({ complete: false, empty: true, error: "" });
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const redirected = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFields>();

  const subtotal = getTotals().subtotal;
  const subtotalAfterDiscount = Math.max(0, subtotal - voucherDiscount);
  const tax = subtotalAfterDiscount * 0.1;
  const postalCodeValue = watch("postalCode") || "";
  const countryValue = watch("country") || "";
  const { quote, loading: shippingLoading } = useShippingQuote(
    subtotalAfterDiscount,
    postalCodeValue,
    countryValue,
  );
  const finalTotal = subtotalAfterDiscount + tax + quote.amount;

  const cardOptions = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "16px",
          color: resolved === "dark" ? "#f9fafb" : "#111827",
          "::placeholder": { color: resolved === "dark" ? "#9ca3af" : "#6b7280" },
        },
        invalid: { color: resolved === "dark" ? "#f87171" : "#b91c1c" },
      },
    }),
    [resolved],
  );

  useEffect(() => {
    let active = true;
    const loadAddresses = async () => {
      try {
        const response = await axios.get<unknown>("/api/auth/addresses");
        if (!active) return;
        if (!Array.isArray(response.data)) {
          setAddressError("Saved addresses could not be loaded. Enter an address below.");
          setUseNewAddress(true);
          return;
        }
        const addresses = response.data as UserAddress[];
        setSavedAddresses(addresses);
        const preferred = addresses.find(isDefaultAddress) || addresses[0];
        if (preferred) {
          const next = addressValues(preferred);
          setSelectedAddressId(preferred.id);
          setUseNewAddress(false);
          setValue("address", next.address);
          setValue("city", next.city);
          setValue("postalCode", next.postalCode);
          setValue("country", next.country);
        } else {
          setUseNewAddress(true);
        }
      } catch {
        if (!active) return;
        setAddressError("Saved addresses could not be loaded. Enter an address below.");
        setUseNewAddress(true);
      } finally {
        if (active) setAddressesLoading(false);
      }
    };
    void loadAddresses();
    return () => {
      active = false;
    };
  }, [setValue]);

  useEffect(() => {
    if (cartLoading || loadError || orderPlaced || cart.items.length > 0 || redirected.current) return;
    redirected.current = true;
    toast.error("Your cart is empty");
    navigate("/cart");
  }, [cart.items.length, cartLoading, loadError, navigate, orderPlaced]);

  const selectAddress = (addressId: number | null) => {
    if (addressId === null) {
      setUseNewAddress(true);
      setSelectedAddressId(null);
      setValue("address", "");
      setValue("city", "");
      setValue("postalCode", "");
      setValue("country", "");
      return;
    }
    setUseNewAddress(false);
    setSelectedAddressId(addressId);
    const address = savedAddresses.find((item) => item.id === addressId);
    if (!address) return;
    const next = addressValues(address);
    setValue("address", next.address);
    setValue("city", next.city);
    setValue("postalCode", next.postalCode);
    setValue("country", next.country);
  };

  const onCardChange = (event: StripeCardElementChangeEvent) => {
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
  };

  const placeOrder = async (data: AddressFields) => {
    if (processing) return;
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
      const orderResponse = await axios.post<{ orderId: number }>("/api/orders", {
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
      });
      const orderId = orderResponse.data.orderId;

      setProcessingMessage("Preparing secure payment...");
      const intentResponse = await axios.post<{ clientSecret: string }>(
        `/api/orders/${orderId}/payment-intent`,
      );

      setProcessingMessage("Processing payment...");
      const paymentResult = await stripe.confirmCardPayment(intentResponse.data.clientSecret, {
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
      const message = messageFrom(error);
      setPaymentError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  };

  if (cartLoading && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-ink">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
        <p className="sr-only">Loading checkout</p>
      </div>
    );
  }

  if (loadError && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
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
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add a product before checking out."
          action={
            <Button type="button" onClick={() => navigate("/products")}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  const showAddressForm = useNewAddress || savedAddresses.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-ink">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card title="Shipping address" className="lg:col-span-2">
          {addressesLoading ? <Skeleton className="mb-4 h-24" /> : null}
          {addressError ? (
            <p className="mb-4 text-sm text-danger" role="alert">
              {addressError}
            </p>
          ) : null}
          <SavedAddressList
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            useNewAddress={useNewAddress}
            disabled={processing}
            onSelect={selectAddress}
          />

          <form className="space-y-4" onSubmit={handleSubmit(placeOrder)} noValidate aria-busy={processing}>
            {showAddressForm ? (
              <AddressForm register={register} errors={errors} disabled={processing} />
            ) : (
              <>
                <input type="hidden" {...register("address", { required: "Address is required" })} />
                <input type="hidden" {...register("city", { required: "City is required" })} />
                <input type="hidden" {...register("postalCode", { required: "Postal code is required" })} />
                <input type="hidden" {...register("country", { required: "Country is required" })} />
              </>
            )}

            <div className="space-y-3 rounded-ui-sm border border-line bg-surface-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Stripe payment (test mode)</p>
                  <p className="mt-1 text-xs text-muted">Your card details are encrypted by Stripe.</p>
                </div>
                <Badge variant="success">Secure</Badge>
              </div>
              <div
                className={`rounded-ui-sm border bg-surface p-3 ${
                  cardState.error ? "border-danger" : cardState.complete ? "border-success" : "border-line"
                }`}
              >
                <CardElement options={cardOptions} onChange={onCardChange} />
              </div>
              <p className="text-xs text-muted">
                Test card: 4242 4242 4242 4242, any future expiry, any CVC, any postcode.
              </p>
              {cardState.complete && !cardState.error ? (
                <p className="rounded-ui-sm border border-success/40 bg-success/10 px-3 py-2 text-xs text-success">
                  Card details look good. You can place your order.
                </p>
              ) : null}
            </div>

            {processing ? (
              <p className="text-sm text-primary" role="status" aria-live="polite">
                {processingMessage || "Processing payment..."}
              </p>
            ) : null}
            {paymentError ? (
              <p className="text-sm text-danger" role="alert">
                {paymentError}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={processing}
              disabled={!stripe || !elements || processing || cardState.empty}
            >
              Place order
            </Button>
            {cardState.empty ? (
              <p className="text-xs text-muted">Enter your card details to place the order.</p>
            ) : null}
          </form>
        </Card>

        <OrderSummary
          items={cart.items}
          subtotal={subtotal}
          tax={tax}
          voucherDiscount={voucherDiscount}
          quote={quote}
          shippingLoading={shippingLoading}
          finalTotal={finalTotal}
          onVoucherApplied={(code, discount) => {
            setVoucherCode(code);
            setVoucherDiscount(discount);
          }}
          onVoucherRemoved={() => {
            setVoucherCode(null);
            setVoucherDiscount(0);
          }}
        />
      </div>
    </div>
  );
}

export default function Checkout() {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [stripeConfigChecked, setStripeConfigChecked] = useState(false);
  const [stripeConfigError, setStripeConfigError] = useState("");

  useEffect(() => {
    let active = true;
    const initStripe = async () => {
      const envPublishableKey = String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
      if (envPublishableKey) {
        if (!active) return;
        setStripePromise(loadStripe(envPublishableKey));
        setStripeConfigChecked(true);
        return;
      }
      try {
        const response = await axios.get<{ publishableKey?: string }>("/api/payments/config");
        if (!active) return;
        const key = response.data.publishableKey || "";
        if (!key) {
          setStripeConfigError("Card payments are unavailable. Stripe is not configured.");
          return;
        }
        setStripePromise(loadStripe(key));
      } catch (error) {
        if (!active) return;
        setStripeConfigError(messageFrom(error));
      } finally {
        if (active) setStripeConfigChecked(true);
      }
    };
    void initStripe();
    return () => {
      active = false;
    };
  }, []);

  if (!stripeConfigChecked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-16" />
        <p className="mt-3 text-sm text-muted" role="status">
          Loading secure payment form...
        </p>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Card payments are unavailable"
          description={stripeConfigError || "Stripe is not configured."}
          action={
            <Button type="button" variant="outline" onClick={() => navigate("/cart")}>
              Back to cart
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
