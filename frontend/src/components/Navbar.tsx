import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBars,
  FaBoxOpen,
  FaCog,
  FaFileInvoice,
  FaHome,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTag,
  FaTimes,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import logoImage from "../assets/images/Logo.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { clearCategoryCache, loadCategories } from "../utils/categoryCache";
import { Button, ThemeToggle } from "./ui";
import { CategoryMenu } from "./navbar/CategoryMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import {
  normalizeCategories,
  type CategoryStatus,
  type NavCategory,
} from "./navbar/categories";

interface ShellUser {
  name?: string;
  email?: string;
  role?: string;
}

const navLink =
  "inline-flex items-center gap-1.5 rounded-ui px-3 py-2 font-ui text-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const navLinkActive = "bg-primary text-on-primary hover:bg-primary-hover";

const iconButton =
  "relative rounded-ui p-2 text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const menuItems = [
  { to: "/profile", icon: FaUser, label: "Profile" },
  { to: "/orders", icon: FaShoppingBag, label: "Orders" },
  { to: "/invoices", icon: FaFileInvoice, label: "Invoices" },
];

function Navbar() {
  const auth = useAuth() as {
    isAuthenticated: boolean;
    user: ShellUser | null;
    logout: () => Promise<void> | void;
  };
  const { getItemCount } = useCart() as { getItemCount: () => number };
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [categoryStatus, setCategoryStatus] = useState<CategoryStatus>("loading");
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = Number(getItemCount()) || 0;
  const isAdmin = auth.user?.role === "admin";

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const activeCategoryId = (() => {
    if (location.pathname !== "/products") {
      return null;
    }
    const value = Number(new URLSearchParams(location.search).get("category"));
    return Number.isFinite(value) ? value : null;
  })();

  const loadNavCategories = async () => {
    setCategoryStatus("loading");
    clearCategoryCache();
    try {
      const data = await loadCategories();
      const list = normalizeCategories(data);
      if (!list) {
        setCategories([]);
        setCategoryStatus("error");
        return;
      }
      setCategories(list);
      setCategoryStatus("ready");
    } catch {
      setCategories([]);
      setCategoryStatus("error");
    }
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setOpenCategoryId(null);
      closeTimerRef.current = null;
    }, 150);
  };

  const openCategory = (categoryId: number) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenCategoryId(categoryId);
  };

  const openFilters = () => {
    setMobileOpen(false);
    if (location.pathname.startsWith("/products")) {
      window.dispatchEvent(new CustomEvent("toggle-filters"));
      return;
    }
    navigate("/products?openFilters=1");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await auth.logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
      setUserMenuOpen(false);
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    let active = true;
    clearCategoryCache();
    loadCategories()
      .then((data: unknown) => {
        if (!active) {
          return;
        }
        const list = normalizeCategories(data);
        setCategories(list ?? []);
        setCategoryStatus(list ? "ready" : "error");
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setCategories([]);
        setCategoryStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const updateTop = () => {
      setMenuTop(headerRef.current?.offsetHeight ?? 0);
    };
    updateTop();
    window.addEventListener("resize", updateTop);
    return () => window.removeEventListener("resize", updateTop);
  }, [categories, categoryStatus]);

  useEffect(() => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    setOpenCategoryId(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    if (userMenuOpen || mobileOpen) {
      document.addEventListener("mousedown", onPointer);
    }
    return () => document.removeEventListener("mousedown", onPointer);
  }, [userMenuOpen, mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setUserMenuOpen(false);
      setOpenCategoryId(null);
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-line bg-surface shadow-ui">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3 rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
            <img src={logoImage} alt="" className="h-10 w-auto object-contain" />
            <span className="min-w-0">
              <span className="block truncate font-ui text-lg font-semibold text-ink">
                Badminton Stores
              </span>
              <span className="hidden text-xs text-muted sm:block">
                Your trusted shopping destination
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Link to="/" className={`${navLink} ${isActive("/", true) ? navLinkActive : ""}`} aria-current={isActive("/", true) ? "page" : undefined}>
              <FaHome aria-hidden="true" /> Home
            </Link>
            <Link to="/products" className={`${navLink} ${isActive("/products") ? navLinkActive : ""}`} aria-current={isActive("/products") ? "page" : undefined}>
              <FaBoxOpen aria-hidden="true" /> Products
            </Link>
            <button type="button" className={navLink} aria-haspopup="dialog" aria-controls="product-filters-drawer" onClick={openFilters}>
              <FaSearch aria-hidden="true" /> Filters
            </button>
            <Link to="/clearance" className={`${navLink} ${isActive("/clearance") ? navLinkActive : ""}`} aria-current={isActive("/clearance") ? "page" : undefined}>
              <FaTag aria-hidden="true" /> Clearance
            </Link>
            <ThemeToggle />
            <Link to="/cart" className={`${navLink} relative ${isActive("/cart") ? navLinkActive : ""}`} aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}>
              <FaShoppingCart aria-hidden="true" /> Cart
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-on-accent">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            {auth.isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className={`${navLink} ${userMenuOpen ? navLinkActive : ""}`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-controls="account-menu"
                  onClick={() => setUserMenuOpen((open) => !open)}
                >
                  <FaUserCircle aria-hidden="true" />
                  <span className="max-w-32 truncate">{auth.user?.name || "Account"}</span>
                </button>
                {userMenuOpen ? (
                  <div id="account-menu" role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-ui-lg border border-line bg-surface py-1 text-ink shadow-ui-md">
                    <div className="border-b border-line px-3 py-2">
                      <p className="text-sm font-semibold">{auth.user?.name}</p>
                      <p className="text-xs text-muted">{auth.user?.email}</p>
                    </div>
                    {menuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        className="flex items-center gap-2 rounded-ui px-3 py-2 font-ui text-sm font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <item.icon className="text-muted" /> {item.label}
                      </Link>
                    ))}
                    {isAdmin ? (
                      <Link
                        to="/admin/dashboard"
                        role="menuitem"
                        className="flex items-center gap-2 border-t border-line px-3 py-2 font-ui text-sm font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaCog className="text-muted" /> Admin dashboard
                      </Link>
                    ) : null}
                    <div className="border-t border-line p-2">
                      <Button type="button" variant="ghost" className="w-full justify-start text-danger" loading={loggingOut} onClick={handleLogout}>
                        <FaSignOutAlt aria-hidden="true" /> Logout
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link to="/login" className={`${navLink} ${isActive("/login") ? navLinkActive : ""}`} aria-current={isActive("/login") ? "page" : undefined}>
                <FaSignInAlt aria-hidden="true" /> Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Link to="/cart" className={iconButton} aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}>
              <FaShoppingBag aria-hidden="true" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-on-accent">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className={iconButton}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>
      <CategoryMenu
        categories={categories}
        status={categoryStatus}
        openCategoryId={openCategoryId}
        activeCategoryId={activeCategoryId}
        menuTop={menuTop}
        onOpen={openCategory}
        onScheduleClose={scheduleClose}
        onRetry={() => {
          void loadNavCategories();
        }}
      />
      <MobileMenu
        open={mobileOpen}
        categories={categories}
        categoriesOpen={mobileCategoriesOpen}
        isAuthenticated={Boolean(auth.isAuthenticated)}
        userName={auth.user?.name}
        userEmail={auth.user?.email}
        isAdmin={Boolean(isAdmin)}
        loggingOut={loggingOut}
        menuItems={menuItems}
        isActive={isActive}
        onClose={() => setMobileOpen(false)}
        onToggleCategories={() => setMobileCategoriesOpen((open) => !open)}
        onOpenFilters={openFilters}
        onLogout={() => {
          void handleLogout();
        }}
        menuRef={mobileMenuRef}
      />
    </header>
  );
}

export default Navbar;
