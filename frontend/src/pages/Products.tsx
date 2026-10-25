import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { Button, EmptyState, Select, Skeleton } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProductsData } from "../hooks/useProductsData";
import usePageTitle from "../hooks/usePageTitle";

const sortOptions = [
  { value: "created_at|DESC", label: "Newest" },
  { value: "price|ASC", label: "Price: low to high" },
  { value: "price|DESC", label: "Price: high to low" },
  { value: "name|ASC", label: "Name: A to Z" },
  { value: "rating|DESC", label: "Highest rated" },
];

function ProductSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className="h-72" />
      ))}
      <p className="sr-only">Loading products</p>
    </div>
  );
}

function Products() {
  usePageTitle("All Products");
  const { addToCart } = useCart() as {
    addToCart: (productId: number, quantity?: number) => Promise<{ success?: boolean; error?: string }>;
  };
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [searchParams, setSearchParams] = useSearchParams();
  const drawerRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const data = useProductsData(searchParams, setSearchParams);
  const {
    filters,
    searchInput,
    products,
    pagination,
    categories,
    subcategories,
    childCategories,
    loading,
    loadError,
    categoryError,
    categoriesLoading,
    handleFilterChange,
    handlePageChange,
    clearFilters,
    reloadProducts,
    reloadCategories,
    isFilterOpen,
    openFilter,
    closeFilter,
  } = data;

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }
    if (isFilterOpen) {
      drawer.removeAttribute("inert");
      const timer = window.setTimeout(() => {
        const firstField = filterContentRef.current?.querySelector<HTMLElement>("input, select, textarea, button");
        firstField?.focus();
      }, 50);
      return () => window.clearTimeout(timer);
    }
    drawer.setAttribute("inert", "");
    return undefined;
  }, [isFilterOpen]);

  useEffect(() => {
    if (!isFilterOpen || !window.matchMedia("(min-width: 1024px)").matches) {
      return undefined;
    }
    document.getElementById("catalog-filters")?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    closeFilter();
    return undefined;
  }, [isFilterOpen, closeFilter]);

  useEffect(() => {
    if (!isFilterOpen) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFilter();
        document.getElementById("open-product-filters")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFilterOpen, closeFilter]);

  const handleAddToCart = async (product: { id: number }) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success("Item added to cart!");
      return;
    }
    toast.error(result.error || "Failed to add item");
  };

  const selectedCategory = categories.find((category) => category.id === Number.parseInt(filters.category, 10));
  const selectedSubcategory = subcategories.find(
    (subcategory) => subcategory.id === Number.parseInt(filters.subcategory, 10),
  );
  const selectedChildCategory = childCategories.find(
    (child) => child.id === Number.parseInt(filters.childCategory, 10),
  );
  const dismiss = () => {
    closeFilter();
    document.getElementById("open-product-filters")?.focus();
  };
  const sortValue = `${filters.sortBy}|${filters.sortOrder || "DESC"}`;
  const sortLabel = sortOptions.find((option) => option.value === sortValue)?.label ?? "Newest";
  const activeFilters = [
    filters.search,
    selectedCategory?.name,
    selectedSubcategory?.name,
    selectedChildCategory?.name,
    filters.minPrice || filters.maxPrice
      ? `${filters.minPrice || "0"}–${filters.maxPrice || "any"}`
      : "",
    sortValue === "created_at|DESC" ? "" : sortLabel,
  ].filter((item): item is string => Boolean(item));
  const renderFilters = () => (
    <FilterSidebar
      categories={categories}
      subcategories={subcategories}
      childCategories={childCategories}
      filters={filters}
      searchValue={searchInput}
      categoryError={categoryError}
      categoriesLoading={categoriesLoading}
      onFilterChange={handleFilterChange}
      onClear={clearFilters}
      onRetryCategories={reloadCategories}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumb
        categoryName={selectedCategory?.name}
        subcategoryName={selectedSubcategory?.name}
        childCategoryName={selectedChildCategory?.name}
        categoryId={selectedCategory?.id}
        subcategoryId={selectedSubcategory?.id}
        childCategoryId={selectedChildCategory?.id}
      />
      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <aside id="catalog-filters" className="mb-8 hidden lg:block">
        <div className="sticky top-28 rounded-ui-lg border border-line bg-surface p-5 shadow-ui">
          <h2 className="mb-4 font-ui text-base font-semibold text-ink">Filters</h2>
          {renderFilters()}
        </div>
      </aside>
      <div className="min-w-0">
      <div className="mb-4 flex min-w-0 flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-4xl text-ink">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "Loading products" : `${pagination.total} ${pagination.total === 1 ? "product" : "products"}`}
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap items-end gap-3">
          <div className="w-full min-w-0 sm:w-56">
            <Select
              label="Sort by"
              value={sortValue}
              options={sortOptions}
              onChange={(event) => handleFilterChange("sort", event.target.value)}
            />
          </div>
          <Button id="open-product-filters" type="button" variant="outline" className="lg:hidden" onClick={openFilter} aria-expanded={isFilterOpen} aria-controls="product-filters-drawer">
            <FaFilter aria-hidden="true" />
            Filters
          </Button>
        </div>
      </div>
      {activeFilters.length > 0 ? (
        <ul className="mb-6 flex min-w-0 flex-wrap gap-2">
          {activeFilters.map((label) => (
            <li key={label} className="max-w-full truncate rounded-full bg-surface-muted px-3 py-1 font-ui text-xs font-semibold text-ink">
              {label}
            </li>
          ))}
        </ul>
      ) : null}

      {isFilterOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close filters"
          onClick={dismiss}
        />
      ) : null}

      <div
        ref={drawerRef}
        id="product-filters-drawer"
        role="dialog"
        aria-modal={isFilterOpen ? true : undefined}
        aria-labelledby="product-filters-title"
        aria-hidden={!isFilterOpen}
        className={`fixed left-0 top-0 z-50 flex h-full w-full max-w-sm transform flex-col border-r border-line bg-surface text-ink shadow-ui-md transition-transform duration-200 ease-out lg:hidden ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <h2 id="product-filters-title" className="font-ui text-lg font-semibold text-ink">
            Filters
          </h2>
          <Button type="button" variant="ghost" size="sm" aria-label="Close filters" onClick={dismiss}>
            Close
          </Button>
        </div>
        <div ref={filterContentRef} className="flex-1 overflow-y-auto p-4">
          {renderFilters()}
        </div>
      </div>

      {loading ? <ProductSkeletons /> : null}
      {!loading && loadError ? (
        <EmptyState
          title="Products could not be loaded"
          description={loadError}
          action={
            <Button type="button" onClick={reloadProducts}>
              Try again
            </Button>
          }
        />
      ) : null}
      {!loading && !loadError && products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try a different search or clear the filters."
          action={
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : null}
      {!loading && !loadError && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : null}
      {!loading && !loadError && products.length > 0 ? (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          limit={pagination.limit}
          total={pagination.total}
          onPageChange={handlePageChange}
        />
      ) : null}
      </div>
      </div>
    </div>
  );
}

export default Products;
