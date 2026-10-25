import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaBox,
  FaComment,
  FaEye,
  FaFileInvoice,
  FaFolder,
  FaFolderOpen,
  FaHome,
  FaImages,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaSitemap,
  FaStar,
  FaTag,
  FaTachometerAlt,
  FaTimes,
  FaUsers,
  FaVideo,
} from "react-icons/fa";
import logoImage from "../../assets/images/Logo.png";
import { useAuth } from "../../context/AuthContext";

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const items: { path: string; label: string; icon: IconType }[] = [
  { path: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { path: "/admin/products", label: "Products", icon: FaBox },
  { path: "/admin/categories", label: "Categories", icon: FaFolder },
  { path: "/admin/subcategories", label: "Subcategories", icon: FaFolderOpen },
  { path: "/admin/child-categories", label: "Child Categories", icon: FaSitemap },
  { path: "/admin/orders", label: "Orders", icon: FaShoppingCart },
  { path: "/admin/carts", label: "Carts", icon: FaShoppingBag },
  { path: "/admin/users", label: "Users", icon: FaUsers },
  { path: "/admin/reviews", label: "Reviews", icon: FaStar },
  { path: "/admin/product-views", label: "Product Views", icon: FaEye },
  { path: "/admin/invoices", label: "Invoices", icon: FaFileInvoice },
  { path: "/admin/vouchers", label: "Vouchers", icon: FaTag },
  { path: "/admin/comments", label: "Comments", icon: FaComment },
  { path: "/admin/images", label: "Images", icon: FaImages },
  { path: "/admin/videos", label: "Videos", icon: FaVideo },
];

const itemClass = (active: boolean) =>
  `flex items-center gap-3 rounded-ui-sm px-3 py-2 font-ui text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
    active ? "bg-primary text-on-primary" : "text-ink hover:bg-surface-muted"
  }`;

export default function SidebarNavigation({ isOpen, onClose }: SidebarNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      onClose();
    }
  }, [location.pathname, onClose]);

  const active = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const signOut = async () => {
    if (loggingOut) {
      return;
    }
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-40 h-full w-64 border-r border-line bg-surface text-ink transition-transform duration-300 motion-reduce:transition-none`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <Link
              to="/admin/dashboard"
              className="flex min-w-0 items-center gap-2 rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <img src={logoImage} alt="" className="h-8 w-auto shrink-0 object-contain" />
              <span className="truncate font-ui text-sm font-semibold text-ink">Badminton Stores</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-ui-sm text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="Close admin menu"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Admin">
            {items.map((item) => {
              const Icon = item.icon;
              const current = active(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={current ? "page" : undefined}
                  className={itemClass(current)}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 space-y-1 border-t border-line pt-4">
            <Link to="/" className={itemClass(false)}>
              <FaHome aria-hidden="true" />
              <span>Back to store</span>
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={loggingOut}
              aria-busy={loggingOut || undefined}
              className={`${itemClass(false)} w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loggingOut ? (
                <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent motion-safe:animate-spin" />
              ) : (
                <FaSignOutAlt aria-hidden="true" />
              )}
              <span>{loggingOut ? "Signing out" : "Log out"}</span>
            </button>
          </div>
        </div>
      </div>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Close admin menu"
          onClick={onClose}
        />
      ) : null}
    </>
  );
}
