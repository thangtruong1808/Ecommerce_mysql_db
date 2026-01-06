/**
 * Order Details Page Component
 * Displays detailed information about a specific order
 *
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import SkeletonLoader from "../components/SkeletonLoader";
import usePageTitle from "../hooks/usePageTitle";

/**
 * OrderDetails component
 * @returns {JSX.Element} Order details page
 */
const OrderDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle(order ? `Order #${order.id}` : "Order Details");

  /**
   * Fetch invoice for order
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!order) return;
      try {
        const response = await axios.get(`/api/invoices`);
        const invoices = response.data.invoices || [];
        const orderInvoice = invoices.find((inv) => inv.order_id === order.id);
        if (orderInvoice) {
          setInvoice(orderInvoice);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load invoice");
      }
    };
    fetchInvoice();
  }, [order]);

  /**
   * Fetch order details
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  /**
   * Format date to dd-MMM-yyyy, hh:mm AM/PM format (e.g., 13-Dec-2025, 2:30 PM)
   * @param {string} dateString - Date string
   * @returns {string} Formatted date with time in 12-hour format
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
  };

  /**
   * Format order number for display
   * @param {Object} order - Order object
   * @returns {string} Formatted order number
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatOrderNumber = (order) => {
    if (order.order_number) {
      return order.order_number;
    }
    // Fallback for existing orders without order_number
    const date = new Date(order.created_at);
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
    return `ORD-${datePart}-${String(order.id).padStart(5, "0")}`;
  };

  /**
   * Get order status badge
   * @param {Object} order - Order object
   * @returns {JSX.Element} Status badge
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getStatusBadge = (order) => {
    if (order.is_delivered) {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
          Delivered
        </span>
      );
    }
    if (order.is_paid) {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
          Processing
        </span>
      );
    }
    return (
      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
        Pending Payment
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <div></div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading state */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Order not found */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h1>
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  /* Order details page layout */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to orders link */}
      <Link
        to="/orders"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
      >
        <FaArrowLeft className="mr-2" />
        <span>Back to Orders</span>
      </Link>

      {/* Order header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order {formatOrderNumber(order)}
          </h1>
          <p className="text-gray-600 mt-2">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        {getStatusBadge(order)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items &&
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b pb-4 last:border-0"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-gray-600">
                        ${(Number(item.price) || 0).toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        $
                        {((Number(item.price) || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-gray-600 text-sm">
                {order.address}
                <br />
                {order.city}, {order.postal_code}
                <br />
                {order.country}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-gray-600 text-sm">
                Method: {order.payment_method}
                <br />
                Status: {order.is_paid ? "Paid" : "Pending"}
                <br />
                {order.paid_at && `Paid on: ${formatDate(order.paid_at)}`}
              </p>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  $
                  {(
                    order.total_price -
                    order.tax_price -
                    order.shipping_price
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span>${parseFloat(order.tax_price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>${parseFloat(order.shipping_price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${parseFloat(order.total_price).toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery information */}
            <div className="mt-4 pt-4 border-t">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Estimated Delivery
                </h3>
                <p className="text-sm text-blue-800">
                  Your order will be delivered within{" "}
                  <strong>3-5 business days</strong> from the date of shipment.
                  We will integrate shipping tracking with our provider soon,
                  and you'll receive tracking information via email once your
                  order ships.
                </p>
              </div>
            </div>

            {invoice && (
              <div className="mt-4 pt-4 border-t">
                <Link
                  to={`/invoices/${invoice.id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  View Invoice
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
