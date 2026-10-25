/**
 * Main App Component
 * Sets up routing and application structure
 *
 * @author Thang Truong
 * @date 2025-12-12
 */

import { lazy, Suspense } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppToast } from "./components/ui";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const CartManagement = lazy(() => import("./pages/admin/CartManagement"));
const CategoryManagement = lazy(() => import("./pages/admin/CategoryManagement"));
const ChildCategoryManagement = lazy(() => import("./pages/admin/ChildCategoryManagement"));
const CommentModeration = lazy(() => import("./pages/admin/CommentModeration"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ImageManagement = lazy(() => import("./pages/admin/ImageManagement"));
const InvoiceManagement = lazy(() => import("./pages/admin/InvoiceManagement"));
const MediaManagement = lazy(() => import("./pages/admin/MediaManagement"));
const OrderManagement = lazy(() => import("./pages/admin/OrderManagement"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const ProductManagement = lazy(() => import("./pages/admin/ProductManagement"));
const ProductViewManagement = lazy(() => import("./pages/admin/ProductViewManagement"));
const ReviewManagement = lazy(() => import("./pages/admin/ReviewManagement"));
const SubcategoryManagement = lazy(() => import("./pages/admin/SubcategoryManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const VideoManagement = lazy(() => import("./pages/admin/VideoManagement"));
const VoucherManagement = lazy(() => import("./pages/admin/VoucherManagement"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Clearance = lazy(() => import("./pages/Clearance"));
const Home = lazy(() => import("./pages/Home"));
const InvoiceDetail = lazy(() => import("./pages/InvoiceDetail"));
const InvoiceList = lazy(() => import("./pages/InvoiceList"));
const Login = lazy(() => import("./pages/Login"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Products = lazy(() => import("./pages/Products"));
const Profile = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResetPasswordConfirm = lazy(() => import("./pages/ResetPasswordConfirm"));

function RouteFallback() {
  return (
    <div className="px-4 py-16 text-center text-muted" role="status" aria-live="polite">
      Loading…
    </div>
  );
}

/**
 * AppContent component - Handles conditional rendering of Navbar/Footer
 * @returns {JSX.Element} Application content
 * @author Thang Truong
 * @date 2025-12-12
 */
const AppContent = () => {
  // Determine if current route is an admin page
  const location = useLocation();

  // Check if the current path starts with /admin
  const isAdminPage = location.pathname.startsWith("/admin");

  /* Main application container */
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-ui focus:bg-surface focus:px-3 focus:py-2 focus:font-ui focus:text-sm focus:font-semibold focus:text-ink focus:shadow-ui-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>
      {!isAdminPage && <Navbar />}
      <main id="main" className="flex-grow">
        <Suspense fallback={<RouteFallback />}>
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
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>

      <AppToast />

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
            // Enable startTransition for route changes
            // Uses React 18 transitions for navigation
            // Smoother UI, non-blocking updates
            v7_startTransition: true,

            // Enable relative splat paths
            // Fixes splat route path resolution
            // More predictable routing, future v7 default
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
