import { useEffect, type ComponentType, type RefObject } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaCog,
  FaHome,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
  FaTag,
} from "react-icons/fa";
import { Button } from "../ui";
import { childCategoriesOf, type NavCategory } from "./categories";

interface MenuItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  open: boolean;
  categories: NavCategory[];
  categoriesOpen: boolean;
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
  isAdmin: boolean;
  loggingOut: boolean;
  menuItems: MenuItem[];
  isActive: (path: string, exact?: boolean) => boolean;
  onClose: () => void;
  onToggleCategories: () => void;
  onOpenFilters: () => void;
  onLogout: () => void;
  menuRef: RefObject<HTMLDivElement>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const row =
  "flex w-full items-center gap-2 rounded-ui px-3 py-2.5 text-left font-ui text-base font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const rowActive = "bg-primary text-on-primary hover:bg-primary-hover";

export function MobileMenu({
  open,
  categories,
  categoriesOpen,
  isAuthenticated,
  userName,
  userEmail,
  isAdmin,
  loggingOut,
  menuItems,
  isActive,
  onClose,
  onToggleCategories,
  onOpenFilters,
  onLogout,
  menuRef,
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const root = menuRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const initial = focusable()[0] ?? root;
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        root?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open, menuRef]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-canvas md:hidden"
      onClick={onClose}
    >
      <div
        ref={menuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        className="flex h-full flex-col overflow-y-auto bg-surface text-ink shadow-ui-md focus-visible:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="font-ui text-sm font-semibold text-ink">Menu</p>
          <button
            type="button"
            className="rounded-ui border border-line px-3 py-1.5 font-ui text-sm font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="space-y-2 px-4 py-4">
          <Link
            to="/"
            onClick={onClose}
            className={`${row} ${isActive("/", true) ? rowActive : ""}`}
            aria-current={isActive("/", true) ? "page" : undefined}
          >
            <FaHome aria-hidden="true" /> Home
          </Link>
          <button
            type="button"
            className={row}
            aria-expanded={categoriesOpen}
            onClick={onToggleCategories}
          >
            <FaBoxOpen aria-hidden="true" /> Products
            <span className="ml-auto text-xs">{categoriesOpen ? "Hide" : "Show"}</span>
          </button>
          {categoriesOpen ? (
            <div className="space-y-3 pl-4">
              {categories.length === 0 ? (
                <p className="text-sm text-muted">No categories yet.</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <Link
                      to={`/products?category=${category.id}`}
                      onClick={onClose}
                      className="block text-sm font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {category.name}
                    </Link>
                    {(category.subcategories ?? []).map((subcategory) => (
                      <div key={subcategory.id} className="space-y-1 pl-2">
                        <Link
                          to={`/products?category=${category.id}&subcategory=${subcategory.id}`}
                          onClick={onClose}
                          className="block text-sm text-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {subcategory.name}
                        </Link>
                        <div className="flex flex-wrap gap-2">
                          {childCategoriesOf(subcategory).map((child) => (
                            <Link
                              key={child.id}
                              to={`/products?category=${category.id}&subcategory=${subcategory.id}&childCategory=${child.id}`}
                              onClick={onClose}
                              className="rounded-full bg-primary/10 px-2 py-1 text-xs text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : null}
          <button type="button" className={row} onClick={onOpenFilters}>
            <FaSearch aria-hidden="true" /> Filters
          </button>
          <Link
            to="/clearance"
            onClick={onClose}
            className={`${row} ${isActive("/clearance") ? rowActive : ""}`}
            aria-current={isActive("/clearance") ? "page" : undefined}
          >
            <FaTag aria-hidden="true" /> Clearance
          </Link>
          {isAuthenticated ? (
            <div className="space-y-1 border-t border-line pt-3">
              <p className="px-2 text-sm font-semibold text-ink">{userName}</p>
              <p className="px-2 text-xs text-muted">{userEmail}</p>
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={row}
                  aria-current={isActive(item.to) ? "page" : undefined}
                >
                  <item.icon className="text-muted" /> {item.label}
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={onClose}
                  className={row}
                  aria-current={isActive("/admin") ? "page" : undefined}
                >
                  <FaCog aria-hidden="true" /> Admin dashboard
                </Link>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-danger"
                loading={loggingOut}
                onClick={onLogout}
              >
                <FaSignOutAlt aria-hidden="true" /> Logout
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className={`${row} border-t border-line`}
              aria-current={isActive("/login") ? "page" : undefined}
            >
              <FaSignInAlt aria-hidden="true" /> Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
