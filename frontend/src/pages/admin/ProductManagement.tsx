import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBox, FaImages, FaTrash } from "react-icons/fa";
import type { Product } from "@shared/catalog";
import AdminLayout from "../../components/admin/AdminLayout";
import InlineEditCell from "../../components/admin/InlineEditCell";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import ProductFormModal from "../../components/admin/ProductFormModal";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import SortableTableHeader from "../../components/admin/SortableTableHeader";
import { Badge, Button, EmptyState, Skeleton } from "../../components/ui";
import { focusRing } from "../../components/ui/styles";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { formatDate } from "../../utils/dateUtils";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import {
  updateProductStock,
  updateProductPrice,
  bulkUpdateProducts,
  deleteProduct,
} from "../../utils/dashboardCrud";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 16;

interface AdminProduct extends Product {
  category_id?: number;
  subcategory_id?: number;
  child_category_name?: string | null;
  has_discount?: boolean | 0 | 1 | null;
}

function ratingLabel(value: unknown): string {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
}

function discountLabel(product: AdminProduct): string {
  const amount = Number(product.discount_value);
  if (!Number.isFinite(amount)) {
    return "";
  }
  return product.discount_type === "percentage" ? `${amount}%` : `$${amount.toFixed(2)}`;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const productsRef = useRef<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: AdminProduct | null }>({
    isOpen: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [formModal, setFormModal] = useState<{ isOpen: boolean; product: AdminProduct | null }>({
    isOpen: false,
    product: null,
  });
  usePageTitle("Products Management");
  const { selected: selectedProducts, toggle, selectAll, clear, selectedCount } = useSelection(products);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(entriesPerPage),
        sortBy,
        sortOrder,
      });
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (stockFilter) {
        params.append("stock", stockFilter);
      }
      const response = await axios.get<{ products?: AdminProduct[]; pagination?: { pages?: number; total?: number } }>(
        `/api/admin/products?${params}`,
        { withCredentials: true },
      );
      const list = Array.isArray(response.data?.products) ? response.data.products : null;
      if (!list) {
        const message = "Products could not be loaded";
        toast.error(message);
        if (productsRef.current.length === 0) {
          setProducts([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      productsRef.current = list;
      setProducts(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Products could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (productsRef.current.length === 0) {
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, entriesPerPage, searchTerm, stockFilter, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleStockUpdate = async (productId: number, newStock: string | number) => {
    try {
      await updateProductStock(productId, Number(newStock));
      void fetchProducts();
    } catch {
      // The stock helper already reports the error.
    }
  };

  const handlePriceUpdate = async (productId: number, newPrice: string | number) => {
    try {
      await updateProductPrice(productId, Number(newPrice));
      void fetchProducts();
    } catch {
      // The price helper already reports the error.
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await deleteProduct(deleteModal.product.id);
      setDeleteModal({ isOpen: false, product: null });
      void fetchProducts();
    } catch {
      // The delete helper already reports the error.
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkAction = async (actionType: string, data?: { stock?: number }) => {
    if (bulkBusy) {
      return;
    }
    setBulkBusy(true);
    try {
      const ids = Array.from(selectedProducts).map((id) => Number(id));
      if (actionType === "delete") {
        for (const id of ids) {
          await deleteProduct(id);
        }
      } else if (actionType === "update-stock") {
        await bulkUpdateProducts(ids, { stock: data?.stock ?? 0 });
      }
      clear();
      void fetchProducts();
    } catch {
      // The product helpers already report the error.
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && products.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-full text-ink">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 border-b border-line pb-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <FaBox className="text-2xl text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Product Management</h1>
          </div>
          <Button id="add-product" onClick={() => setFormModal({ isOpen: true, product: null })}>
            Add product
          </Button>
        </div>

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterValue={stockFilter}
          onFilterChange={(value: string) => {
            setStockFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Stock" },
            { value: "in_stock", label: "In Stock" },
            { value: "low_stock", label: "Low Stock" },
            { value: "out_of_stock", label: "Out of Stock" },
          ]}
          searchPlaceholder="Search products..."
        />

        <Pagination
          position="top"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value: number) => {
            setEntriesPerPage(value);
            setPage(1);
          }}
        />

        {loading && products.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}

        {showLoadError ? (
          <EmptyState
            title="Products could not be loaded"
            description={error}
            action={
              <Button id="products-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </Button>
            }
          />
        ) : null}

        {!showLoadError && !(loading && products.length === 0) ? (
          <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <BulkSelectCheckbox
                        isSelectAll
                        totalItems={products.length}
                        selectedCount={selectedCount}
                        onSelectAll={selectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">#</th>
                    <SortableTableHeader label="ID Product" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Name" field="name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Description" field="description" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Price" field="price" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Child Category" field="child_category_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Stock" field="stock" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Rating" field="rating" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Reviews" field="num_reviews" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Discount Type" field="discount_type" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Discount Value" field="discount_value" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Clearance" field="is_on_clearance" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {products.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="text-lg font-medium text-muted">
                          {searchTerm ? `No products found matching "${searchTerm}"` : "No products found"}
                        </p>
                        {searchTerm ? (
                          <p className="mt-2 text-sm text-muted">Try a different search, or clear the search to see every product.</p>
                        ) : null}
                      </td>
                    </tr>
                  ) : (
                    products.map((product, index) => {
                      const discount = discountLabel(product);
                      return (
                        <tr key={product.id} className="hover:bg-surface-muted">
                          <td className="px-6 py-4">
                            <BulkSelectCheckbox
                              itemId={product.id}
                              isSelected={selectedProducts.has(product.id)}
                              onToggle={toggle}
                            />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">{(page - 1) * entriesPerPage + index + 1}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">{product.id}</td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => setFormModal({ isOpen: true, product })}
                              className={`text-left text-primary hover:underline ${focusRing}`}
                              aria-label={`Edit ${product.name}`}
                            >
                              {product.name}
                            </button>
                          </td>
                          <td className="max-w-xs truncate px-6 py-4 text-sm text-muted" title={product.description}>
                            {product.description || <span className="text-muted">No description</span>}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <InlineEditCell value={product.price || 0} type="number" onSave={(newPrice: string | number) => handlePriceUpdate(product.id, newPrice)} />
                          </td>
                          <td className="px-6 py-4 text-sm text-muted">{product.child_category_name || "N/A"}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <InlineEditCell value={product.stock || 0} type="number" onSave={(newStock: string | number) => handleStockUpdate(product.id, newStock)} />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{ratingLabel(product.rating)}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{product.num_reviews || 0}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                            {product.discount_type ? (
                              <div className="flex flex-col items-start gap-1">
                                <span className="capitalize">{product.discount_type}</span>
                                <Badge variant={product.has_discount ? "success" : "neutral"}>
                                  {product.has_discount ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            ) : (
                              <span>N/A</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{discount || "N/A"}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {product.is_on_clearance ? <Badge variant="warning">Yes</Badge> : <span className="text-muted">No</span>}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(product.created_at || "")}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(product.updated_at || "")}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/admin/products/${product.id}/media`}
                                className={`inline-flex items-center gap-1 rounded-ui-sm bg-primary px-2 py-1 text-xs text-on-primary hover:bg-primary-hover ${focusRing}`}
                                aria-label={`Manage media for ${product.name}`}
                              >
                                <FaImages className="h-3 w-3" aria-hidden="true" />
                                Media
                              </Link>
                              <button
                                type="button"
                                onClick={() => setDeleteModal({ isOpen: true, product })}
                                className={`inline-flex items-center gap-1 rounded-ui-sm bg-danger px-2 py-1 text-xs text-on-danger hover:bg-danger-hover ${focusRing}`}
                                aria-label={`Delete ${product.name}`}
                              >
                                <FaTrash className="h-3 w-3" aria-hidden="true" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <Pagination
          position="bottom"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value: number) => {
            setEntriesPerPage(value);
            setPage(1);
          }}
        />

        <ConfirmDeleteModal
          entity={deleteModal.product}
          entityType="product"
          isOpen={deleteModal.isOpen}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteModal({ isOpen: false, product: null });
            }
          }}
        />

        <ProductFormModal
          isOpen={formModal.isOpen}
          onClose={() => setFormModal({ isOpen: false, product: null })}
          onSuccess={() => {
            setFormModal({ isOpen: false, product: null });
            void fetchProducts();
          }}
          product={formModal.product}
        />

        {selectedCount > 0 ? (
          <BulkActionBar
            selectedCount={selectedCount}
            busy={bulkBusy}
            actions={[
              { type: "delete", label: "Delete Selected" },
              { type: "update-stock", label: "Update Stock", data: { stock: 0 } },
            ]}
            onAction={handleBulkAction}
            onCancel={clear}
          />
        ) : null}
      </div>
    </AdminLayout>
  );
}
