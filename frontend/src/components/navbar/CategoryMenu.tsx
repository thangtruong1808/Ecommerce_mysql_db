import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import { Button } from "../ui";
import { Skeleton } from "../ui/Skeleton";
import {
  childCategoriesOf,
  clearanceLayout,
  type NavCategory,
  type CategoryStatus,
} from "./categories";

interface CategoryMenuProps {
  categories: NavCategory[];
  status: CategoryStatus;
  openCategoryId: number | null;
  activeCategoryId: number | null;
  menuTop: number;
  onOpen: (categoryId: number) => void;
  onScheduleClose: () => void;
  onRetry: () => void;
}

const categoryLink =
  "rounded-ui px-2.5 py-1 font-ui text-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function CategoryMenu({
  categories,
  status,
  openCategoryId,
  activeCategoryId,
  menuTop,
  onOpen,
  onScheduleClose,
  onRetry,
}: CategoryMenuProps) {
  const openCategory = categories.find((category) => category.id === openCategoryId);
  const subcategories = openCategory?.subcategories ?? [];
  const clearance = openCategory ? clearanceLayout(subcategories.length) : null;

  return (
    <div className="relative hidden border-t border-line md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2">
        {status === "loading" ? (
          <div className="flex flex-1 gap-3" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-6 w-24" />
            ))}
          </div>
        ) : null}
        {status === "loading" ? (
          <p className="sr-only">Loading categories</p>
        ) : null}
        {status === "error" ? (
          <div className="flex items-center gap-3 text-sm text-ink">
            <p>Categories could not be loaded.</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              Retry
            </Button>
          </div>
        ) : null}
        {status === "ready" && categories.length === 0 ? (
          <p className="text-sm text-muted">No categories yet.</p>
        ) : null}
        {status === "ready"
          ? categories.map((category) => {
              const open = category.id === openCategoryId;
              const active = category.id === activeCategoryId;
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className={`${categoryLink} ${open || active ? "bg-primary text-on-primary hover:bg-primary-hover" : ""}`}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={open}
                  onMouseEnter={() => onOpen(category.id)}
                  onMouseLeave={onScheduleClose}
                  onFocus={() => onOpen(category.id)}
                  onBlur={onScheduleClose}
                >
                  {category.name}
                </Link>
              );
            })
          : null}
      </div>
      {openCategory && clearance ? (
        <div
          className="fixed inset-x-0 z-40 border-t border-line bg-surface text-ink shadow-ui-md"
          style={{ top: menuTop }}
          onMouseEnter={() => onOpen(openCategory.id)}
          onMouseLeave={onScheduleClose}
          onFocus={() => onOpen(openCategory.id)}
          onBlur={onScheduleClose}
        >
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-4">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="space-y-3">
                <Link
                  to={`/products?category=${openCategory.id}&subcategory=${subcategory.id}`}
                  className="block rounded-ui font-ui text-base font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {subcategory.name}
                </Link>
                <div className="flex flex-wrap gap-2">
                  {childCategoriesOf(subcategory).map((child) => (
                    <Link
                      key={child.id}
                      to={`/products?category=${openCategory.id}&subcategory=${subcategory.id}&childCategory=${child.id}`}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div
              style={{
                gridRow: clearance.row,
                gridColumn: `${clearance.columnStart} / span ${clearance.columnSpan}`,
              }}
            >
              <Link
                to={`/clearance?category=${openCategory.id}&categoryName=${encodeURIComponent(openCategory.name)}`}
                className="flex min-h-48 flex-col justify-between rounded-ui-lg border border-line bg-canvas p-6 text-ink transition-colors duration-150 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span>
                  <FaTag className="mb-2 text-2xl text-accent" aria-hidden="true" />
                  <span className="block font-display text-2xl text-ink">
                    {openCategory.name} Clearance
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    Explore exclusive deals on {openCategory.name.toLowerCase()} items
                  </span>
                </span>
                <span className="font-ui text-sm font-semibold text-primary">Shop now</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
