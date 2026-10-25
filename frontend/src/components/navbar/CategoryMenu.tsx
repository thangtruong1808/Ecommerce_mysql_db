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
  "rounded-ui-sm px-2 py-1 text-sm font-medium text-on-primary transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

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
    <div className="relative hidden border-t border-white/20 md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2">
        {status === "loading" ? (
          <div className="flex flex-1 gap-3" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-6 w-24 bg-white/30" />
            ))}
          </div>
        ) : null}
        {status === "loading" ? (
          <p className="sr-only">Loading categories</p>
        ) : null}
        {status === "error" ? (
          <div className="flex items-center gap-3 text-sm text-on-primary">
            <p>Categories could not be loaded.</p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRetry}
            >
              Retry
            </Button>
          </div>
        ) : null}
        {status === "ready" && categories.length === 0 ? (
          <p className="text-sm text-on-primary">No categories yet.</p>
        ) : null}
        {status === "ready"
          ? categories.map((category) => {
              const open = category.id === openCategoryId;
              const active = category.id === activeCategoryId;
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className={`${categoryLink} ${open || active ? "bg-primary-hover" : ""}`}
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
                  className="block text-base font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                className="flex min-h-48 flex-col justify-between rounded-ui-lg bg-accent p-6 text-on-accent transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
              >
                <span>
                  <FaTag className="mb-2 text-3xl" aria-hidden="true" />
                  <span className="block text-2xl font-bold">
                    {openCategory.name} Clearance
                  </span>
                  <span className="mt-2 block text-sm">
                    Explore exclusive deals on {openCategory.name.toLowerCase()} items
                  </span>
                </span>
                <span className="text-sm font-semibold underline">Shop now</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
