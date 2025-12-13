/**
 * Main App Component
 * Sets up routing and application structure
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Clearance from './pages/Clearance'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import OrderDetails from './pages/OrderDetails'
import AdminDashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import UserManagement from './pages/admin/UserManagement'
import ProductForm from './pages/admin/ProductForm'
import VoucherManagement from './pages/admin/VoucherManagement'
import CommentModeration from './pages/admin/CommentModeration'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetail from './pages/InvoiceDetail'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Main App component
 * @returns {JSX.Element} Application root
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          {/* Main application container with flex layout for sticky footer */}
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation bar */}
            <Navbar />
          
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
            <Route path="/reset-password/:token" element={<ResetPasswordConfirm />} />
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
              position="top-right" 
              autoClose={10000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          
            {/* Site footer - sticks to bottom */}
            <Footer />
          </div>
      </Router>
    </CartProvider>
  </AuthProvider>
)
}

export default App
