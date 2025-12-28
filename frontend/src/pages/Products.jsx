/**
 * Products Page Component
 * Displays product listing with filters, search, and pagination
 * Supports hierarchical category filtering (category -> subcategory -> child category)
 *
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import FilterSidebar from "../components/FilterSidebar";
import Breadcrumb from "../components/Breadcrumb";
import { useProductsData } from "../hooks/useProductsData";

/**
 * Products component
 * @returns {JSX.Element} Products listing page
 * @author Thang Truong
 * @date 2025-12-17
 */
const Products = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterContentRef = useRef(null);
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
    handleFilterChange,
    handlePageChange,
    clearFilters,
    isFilterOpen,
    openFilter,
    closeFilter,
  } = data;

  /**
   * Focus first field in filter drawer when opened
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    if (isFilterOpen) {
      const timer = setTimeout(() => {
        const firstField = filterContentRef.current?.querySelector(
          "input, select, textarea, button"
        );
        firstField?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isFilterOpen]);

  /**
   * Handle add to cart event
   * @param {number} productId - Product ID to add to cart
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success("Item added to cart!");
    } else {
      toast.error(result.error || "Failed to add item");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        <SkeletonLoader type="card" count={6} />
      </div>
    );
  }

  /**
   * Get selected category info for breadcrumb navigation
   * @author Thang Truong
   * @date 2025-12-17
   */
  const selectedCategory = categories.find(
    (cat) => cat.id === parseInt(filters.category)
  );
  const selectedSubcategory = subcategories.find(
    (sub) => sub.id === parseInt(filters.subcategory)
  );
  const selectedChildCategory = childCategories.find(
    (child) => child.id === parseInt(filters.childCategory)
  );

  /* Products page main container with filters drawer, product grid, and pagination */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb navigation showing category hierarchy */}
      <Breadcrumb
        categoryName={selectedCategory?.name}
        subcategoryName={selectedSubcategory?.name}
        childCategoryName={selectedChildCategory?.name}
        categoryId={selectedCategory?.id}
        subcategoryId={selectedSubcategory?.id}
        childCategoryId={selectedChildCategory?.id}
      />

      {/* Page header with title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      </div>

      {/* Drawer overlay - darkens background when filters drawer is open */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={closeFilter}
        />
      )}

      <div className="relative">
        {/* Filters drawer - slides in from left */}
        <div
          id="product-filters-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-filters-title"
          tabIndex={-1}
          className={`fixed z-50 top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-200 ease-out ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer header with title and close button */}
          <div className="drawer-header h-16 flex items-center justify-between px-4 border-b">
            <h2 id="product-filters-title" className="text-lg font-semibold">
              Filters
            </h2>
            <button
              type="button"
              onClick={closeFilter}
              className="text-gray-600 text-sm hover:text-gray-900"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          {/* Drawer body with filter controls */}
          {isFilterOpen && (
            <div ref={filterContentRef} className="drawer-body p-4">
              <FilterSidebar
                categories={categories}
                subcategories={subcategories}
                childCategories={childCategories}
                filters={filters}
                searchValue={searchInput}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
              />
            </div>
          )}
          {/* Drawer footer with close button */}
          {isFilterOpen && (
            <div className="drawer-footer p-4 border-t space-x-2">
              <button
                type="button"
                className="btn btn-soft btn-secondary inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={closeFilter}
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Products grid container */}
        <div className="lg:ml-0">
          {/* Empty state when no products found */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            /* Product grid - responsive columns based on screen size */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Pagination controls - shown when products exist */}
          {products.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
