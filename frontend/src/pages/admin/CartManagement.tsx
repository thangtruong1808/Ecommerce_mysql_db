import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import SortableTableHeader from "../../components/admin/SortableTableHeader";
import CartViewModal from "../../components/admin/CartViewModal";
import CartTableRow, { type AdminCart } from "../../components/admin/CartTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 10;

interface CartsResponse {
  carts?: AdminCart[];
  pagination?: { pages?: number; total?: number };
}

export default function CartManagement() {
  usePageTitle("Cart Management");
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const cartsRef = useRef<AdminCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState<AdminCart | null>(null);
  const [viewCart, setViewCart] = useState<AdminCart | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(carts);
  const requestId = useRef(0);

  const fetchCarts = useCallback(async () => {
    const id = ++requestId.current;
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
      const response = await axios.get<CartsResponse>(`/api/admin/carts?${params}`);
      const list = Array.isArray(response.data?.carts) ? response.data.carts : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Carts could not be loaded";
        toast.error(message);
        if (cartsRef.current.length === 0) {
          setCarts([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      cartsRef.current = list;
      setCarts(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Carts could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (cartsRef.current.length === 0) {
        setCarts([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, searchTerm, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchCarts();
  }, [fetchCarts]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleView = async (cartId: number) => {
    if (viewingId !== null || deleting || bulkBusy) {
      return;
    }
    setViewingId(cartId);
    try {
      const response = await axios.get<AdminCart>(`/api/admin/carts/${cartId}`);
      setViewCart(response.data);
    } catch (viewError: unknown) {
      if (!shouldSuppress401Toast(viewError)) {
        toast.error(messageFrom(viewError, "Failed to load cart details"));
      }
    } finally {
      setViewingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/carts/${deleteTarget.id}`);
      toast.success("Cart deleted successfully");
      setDeleteTarget(null);
      await fetchCarts();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete cart"));
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (bulkBusy || viewingId !== null) {
      return;
    }
    const ids = Array.from(selected).map((id) => Number(id));
    setBulkBusy(true);
    try {
      await axios.post("/api/admin/carts/bulk-delete", { cartIds: ids });
      toast.success(`${ids.length} cart(s) deleted successfully`);
      clear();
      await fetchCarts();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete carts"));
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && carts.length === 0;
  const rowLocked = viewingId !== null || deleting || bulkBusy;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-full text-ink">
        <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
          <FaShoppingCart className="text-2xl text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Cart Management</h1>
        </div>
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search by cart ID, user ID, name, or email..."
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
        {loading && carts.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Carts could not be loaded"
            description={error}
            action={<Button id="carts-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && carts.length === 0) ? (
          <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <BulkSelectCheckbox isSelectAll totalItems={carts.length} selectedCount={selectedCount} onSelectAll={selectAll} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">#</th>
                    <SortableTableHeader label="ID Cart" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="User ID" field="user_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="User" field="user_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Items" field="item_count" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Total Value" field="total_value" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {carts.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="text-lg font-medium text-muted">
                          {searchTerm ? `No carts found matching "${searchTerm}"` : "No carts found"}
                        </p>
                        {searchTerm ? (
                          <p className="mt-2 text-sm text-muted">Try adjusting your search terms or clear the search to see all carts.</p>
                        ) : null}
                      </td>
                    </tr>
                  ) : (
                    carts.map((cart, index) => (
                      <CartTableRow
                        key={cart.id}
                        cart={cart}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(cart.id)}
                        viewBusy={viewingId === cart.id}
                        locked={rowLocked}
                        onToggle={toggle}
                        onView={() => { void handleView(cart.id); }}
                        onDelete={() => setDeleteTarget(cart)}
                      />
                    ))
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
        <CartViewModal cart={viewCart} isOpen={Boolean(viewCart)} onClose={() => setViewCart(null)} />
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="cart"
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        {selectedCount > 0 ? (
          <BulkActionBar
            selectedCount={selectedCount}
            busy={bulkBusy}
            actions={[{ type: "delete", label: "Delete Selected" }]}
            onAction={(actionType: string) => {
              if (actionType === "delete") {
                void handleBulkDelete();
              }
            }}
            onCancel={clear}
          />
        ) : null}
      </div>
    </AdminLayout>
  );
}
