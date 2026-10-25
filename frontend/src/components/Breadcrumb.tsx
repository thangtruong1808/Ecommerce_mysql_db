import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadcrumbProps {
  categoryName?: string | null;
  subcategoryName?: string | null;
  childCategoryName?: string | null;
  categoryId?: number | string | null;
  subcategoryId?: number | string | null;
  childCategoryId?: number | string | null;
  productName?: string | null;
}

interface Crumb {
  label: string;
  path: string | null;
}

function Breadcrumb({
  categoryName,
  subcategoryName,
  childCategoryName,
  categoryId,
  subcategoryId,
  childCategoryId,
  productName,
}: BreadcrumbProps) {
  const location = useLocation();
  const items: Crumb[] = [{ label: "Home", path: "/" }];

  if (location.pathname === "/products" && !categoryName && !productName) {
    items.push({ label: "Products", path: "/products" });
  }
  if (categoryName && categoryId) {
    items.push({
      label: categoryName,
      path: `/products?category=${categoryId}`,
    });
  }
  if (subcategoryName && subcategoryId && categoryId) {
    items.push({
      label: subcategoryName,
      path: `/products?category=${categoryId}&subcategory=${subcategoryId}`,
    });
  }
  if (childCategoryName && childCategoryId && categoryId && subcategoryId) {
    items.push({
      label: childCategoryName,
      path: `/products?category=${categoryId}&subcategory=${subcategoryId}&childCategory=${childCategoryId}`,
    });
  }
  if (productName) {
    items.push({ label: productName, path: null });
  }

  if (items.length <= 1 && location.pathname !== "/products") {
    return null;
  }

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-ui text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <FaChevronRight className="text-muted" aria-hidden="true" />
              ) : null}
              {item.path && !current ? (
                <Link
                  to={item.path}
                  className="inline-flex items-center gap-1 rounded-ui-sm text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {index === 0 ? <FaHome aria-hidden="true" /> : null}
                  {item.label}
                </Link>
              ) : (
                <span
                  className="inline-flex items-center gap-1 font-medium text-ink"
                  aria-current={current ? "page" : undefined}
                >
                  {index === 0 ? <FaHome aria-hidden="true" /> : null}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
