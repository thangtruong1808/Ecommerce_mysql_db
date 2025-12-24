/**
 * Main App Component
 * Sets up routing and application structure
 *
 * @author Thang Truong
 * @date 2025-12-12
 */

import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CartManagement from "./pages/admin/CartManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ChildCategoryManagement from "./pages/admin/ChildCategoryManagement";
import CommentModeration from "./pages/admin/CommentModeration";
import AdminDashboard from "./pages/admin/Dashboard";
import ImageManagement from "./pages/admin/ImageManagement";
import InvoiceManagement from "./pages/admin/InvoiceManagement";
import MediaManagement from "./pages/admin/MediaManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ProductForm from "./pages/admin/ProductForm";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductViewManagement from "./pages/admin/ProductViewManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";
import SubcategoryManagement from "./pages/admin/SubcategoryManagement";
import UserManagement from "./pages/admin/UserManagement";
import VideoManagement from "./pages/admin/VideoManagement";
import VoucherManagement from "./pages/admin/VoucherManagement";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Clearance from "./pages/Clearance";
import Home from "./pages/Home";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceList from "./pages/InvoiceList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

/**
 * AppContent component - Handles conditional rendering of Navbar/Footer
 * @returns {JSX.Element} Application content
 * @author Thang Truong
 * @date 2025-12-12
 */
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  /* Main application container */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation bar - hidden on admin pages */}
      {!isAdminPage && <Navbar />}

      {/* Route definitions - flex-grow to push footer down */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/clearance" element={<Clearance />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute adminOnly>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <OrderManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vouchers"
            element={
              <ProtectedRoute adminOnly>
                <VoucherManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/comments"
            element={
              <ProtectedRoute adminOnly>
                <CommentModeration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:productId/media"
            element={
              <ProtectedRoute adminOnly>
                <MediaManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/images"
            element={
              <ProtectedRoute adminOnly>
                <ImageManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/videos"
            element={
              <ProtectedRoute adminOnly>
                <VideoManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute adminOnly>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subcategories"
            element={
              <ProtectedRoute adminOnly>
                <SubcategoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/child-categories"
            element={
              <ProtectedRoute adminOnly>
                <ChildCategoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/carts"
            element={
              <ProtectedRoute adminOnly>
                <CartManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute adminOnly>
                <ReviewManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/product-views"
            element={
              <ProtectedRoute adminOnly>
                <ProductViewManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute adminOnly>
                <InvoiceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <InvoiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute>
                <InvoiceDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Toast notifications container with 10 second auto-close and progress bar */}
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Site footer - hidden on admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

/**
 * Main App component
 * @returns {JSX.Element} Application root
 * @author Thang Truong
 * @date 2025-12-12
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
