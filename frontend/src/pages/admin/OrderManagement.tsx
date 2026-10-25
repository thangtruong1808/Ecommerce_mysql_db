import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingBag } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import SortableTableHeader from "../../components/admin/SortableTableHeader";
import OrderTableRow, { type AdminOrder } from "../../components/admin/OrderTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { bulkUpdateOrders, deleteOrder, updateOrderStatus } from "../../utils/dashboardCrud";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 20;

interface OrdersResponse {
  orders?: AdminOrder[];
  pagination?: { pages?: number; total?: number };
}

export default function OrderManagement() {
  usePageTitle("Order Management");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const ordersRef = useRef<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [statusOrderId, setStatusOrderId] = useState<number | null>(null);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(orders);
  const requestId = useRef(0);

  const fetchOrders = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(entriesPerPage),
        sortBy,
        sortOrder,
      });
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      const response = await axios.get<OrdersResponse>(`/api/admin/orders?${params}`);
      const list = Array.isArray(response.data?.orders) ? response.data.orders : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Orders could not be loaded";
        toast.error(message);
        if (ordersRef.current.length === 0) {
          setOrders([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      if (id !== requestId.current) {
        return;
      }
      ordersRef.current = list;
      setOrders(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Orders could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (ordersRef.current.length === 0) {
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, statusFilter, searchTerm, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (statusOrderId !== null || bulkBusy) {
      return;
    }
    setStatusOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } finally {
      setStatusOrderId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
      await fetchOrders();
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkAction = async (actionType: string, data?: { status?: string }) => {
    if (bulkBusy || statusOrderId !== null) {
      return;
    }
    setBulkBusy(true);
    try {
      if (actionType === "update-status" && data?.status) {
        await bulkUpdateOrders(Array.from(selected).map((id) => Number(id)), { status: data.status });
      } else if (actionType === "delete") {
        for (const id of selected) {
          await deleteOrder(Number(id));
        }
      }
      clear();
      await fetchOrders();
    } finally {
      setBulkBusy(false);
    }
  };

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const showLoadError = Boolean(error) && orders.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-full text-ink">
        <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
          <FaShoppingBag className="text-2xl text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Order Management</h1>
        </div>
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterValue={statusFilter}
          onFilterChange={(value: string) => {
            setStatusFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Orders" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "delivered", label: "Delivered" },
          ]}
          searchPlaceholder="Search orders..."
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
        {loading && orders.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Orders could not be loaded"
            description={error}
            action={<Button id="orders-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && orders.length === 0) ? (
          <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <BulkSelectCheckbox isSelectAll totalItems={orders.length} selectedCount={selectedCount} onSelectAll={selectAll} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">#</th>
                    <SortableTableHeader label="ID Order" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Order Number" field="order_number" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="User ID" field="user_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="User" field="user_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Voucher ID" field="voucher_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Voucher Discount" field="voucher_discount" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Payment Method" field="payment_method" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Payment Status" field="payment_status" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Tax" field="tax_price" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Shipping" field="shipping_price" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Total" field="total_price" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Paid" field="is_paid" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Paid At" field="paid_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Delivered" field="is_delivered" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Delivered At" field="delivered_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {orders.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="text-lg font-medium text-muted">
                          {searchTerm ? `No orders found matching "${searchTerm}"` : "No orders found"}
                        </p>
                        {searchTerm ? <p className="mt-2 text-sm text-muted">Try adjusting your search terms or clear the search to see all orders.</p> : null}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <OrderTableRow
                        key={order.id}
                        order={order}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(order.id)}
                        statusBusy={statusOrderId === order.id}
                        onToggle={toggle}
                        onStatusChange={(status) => { void handleStatusChange(order.id, status); }}
                        onDelete={() => setDeleteTarget(order)}
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
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="order"
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
            actions={[
              { type: "update-status", label: "Mark as Paid", data: { status: "paid" } },
              { type: "update-status", label: "Mark as Delivered", data: { status: "delivered" } },
              { type: "delete", label: "Delete Selected" },
            ]}
            onAction={(actionType: string, data?: { status?: string }) => { void handleBulkAction(actionType, data); }}
            onCancel={clear}
          />
        ) : null}
      </div>
    </AdminLayout>
  );
}
