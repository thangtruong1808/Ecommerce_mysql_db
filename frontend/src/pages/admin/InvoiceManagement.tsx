import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileInvoice } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CategoryBulkBar,
  CategoryPageBar,
  CategorySelectBox,
  CategorySortHeader,
  CategoryToolbar,
} from "../../components/admin/categoryListChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import InvoiceEditModal, { type InvoiceEditInput } from "../../components/admin/InvoiceEditModal";
import InvoiceTableRow, { type AdminInvoice } from "../../components/admin/InvoiceTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 18;

interface InvoicesResponse {
  invoices?: AdminInvoice[];
  pagination?: { pages?: number; total?: number };
}

export default function InvoiceManagement() {
  usePageTitle("Invoice Management");
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const invoicesRef = useRef<AdminInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState<AdminInvoice | null>(null);
  const [editInvoice, setEditInvoice] = useState<AdminInvoice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(invoices);
  const requestId = useRef(0);

  const fetchInvoices = useCallback(async () => {
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
      if (statusFilter) {
        params.append("paymentStatus", statusFilter);
      }
      const response = await axios.get<InvoicesResponse>(`/api/admin/invoices?${params}`);
      const list = Array.isArray(response.data?.invoices) ? response.data.invoices : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Invoices could not be loaded";
        toast.error(message);
        if (invoicesRef.current.length === 0) {
          setInvoices([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      invoicesRef.current = list;
      setInvoices(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Invoices could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (invoicesRef.current.length === 0) {
        setInvoices([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, searchTerm, statusFilter, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchInvoices();
  }, [fetchInvoices]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleUpdate = async (data: InvoiceEditInput) => {
    if (!editInvoice) {
      return;
    }
    try {
      await axios.put(`/api/admin/invoices/${editInvoice.id}`, data);
      toast.success("Invoice updated successfully");
      setEditInvoice(null);
      await fetchInvoices();
    } catch (updateError: unknown) {
      if (!shouldSuppress401Toast(updateError)) {
        toast.error(messageFrom(updateError, "Failed to update invoice"));
      }
      throw updateError;
    }
  };

  const handleResendEmail = async (invoiceId: number) => {
    if (actingId !== null || deleting || bulkBusy) {
      return;
    }
    setActingId(invoiceId);
    try {
      await axios.post(`/api/admin/invoices/${invoiceId}/resend-email`);
      toast.success("Invoice email sent successfully");
      await fetchInvoices();
    } catch (sendError: unknown) {
      if (!shouldSuppress401Toast(sendError)) {
        toast.error(messageFrom(sendError, "Failed to send invoice email"));
      }
    } finally {
      setActingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/invoices/${deleteTarget.id}`);
      toast.success("Invoice deleted successfully");
      setDeleteTarget(null);
      await fetchInvoices();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete invoice"));
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (bulkBusy || actingId !== null) {
      return;
    }
    const ids = Array.from(selected).map((id) => Number(id));
    setBulkBusy(true);
    try {
      await axios.post("/api/admin/invoices/bulk-delete", { invoiceIds: ids });
      toast.success(`${ids.length} invoice(s) deleted successfully`);
      clear();
      await fetchInvoices();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete invoices"));
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && invoices.length === 0;
  const rowLocked = actingId !== null || deleting || bulkBusy;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
          <FaFileInvoice className="shrink-0 text-2xl text-primary" aria-hidden="true" />
          <h1 className="font-ui text-3xl font-semibold">Invoice Management</h1>
        </div>
        <CategoryToolbar
          searchId="invoice-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search by invoice number, order number, user name, or email..."
          filterId="invoice-status-filter"
          filterLabel="Payment status"
          filterValue={statusFilter}
          onFilterChange={(value: string) => {
            setStatusFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Statuses" },
            { value: "succeeded", label: "Succeeded" },
            { value: "completed", label: "Completed" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
          ]}
        />
        <CategoryPageBar
          position="top"
          pageSizeId="invoice-page-size"
          paginationLabel="Invoices pagination"
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
        {loading && invoices.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Invoices could not be loaded"
            description={error}
            action={<Button id="invoices-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && invoices.length === 0) ? (
          <div className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <CategorySelectBox
                        pressed={invoices.length > 0 && selectedCount === invoices.length}
                        label="Select all invoices on this page"
                        onClick={() => selectAll(selectedCount < invoices.length)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">#</th>
                    <CategorySortHeader label="ID Invoice" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Invoice Number" field="invoice_number" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Order ID" field="order_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Order Number" field="order_number" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="User ID" field="user_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="User" field="user_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Subtotal" field="subtotal" align="right" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Tax" field="tax_amount" align="right" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Shipping" field="shipping_amount" align="right" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Total" field="total_amount" align="right" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Payment Method" field="payment_method" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Payment Status" field="payment_status" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Email Sent" field="email_sent" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Email Sent At" field="email_sent_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {invoices.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="font-ui text-lg font-medium text-muted">
                          {searchTerm ? `No invoices found matching "${searchTerm}"` : "No invoices found"}
                        </p>
                        {searchTerm ? (
                          <p className="mt-2 font-ui text-sm text-muted">Try adjusting your search terms or clear the search to see all invoices.</p>
                        ) : null}
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice, index) => (
                      <InvoiceTableRow
                        key={invoice.id}
                        invoice={invoice}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(invoice.id)}
                        emailBusy={actingId === invoice.id}
                        locked={rowLocked}
                        onToggle={toggle}
                        onResendEmail={() => { void handleResendEmail(invoice.id); }}
                        onEdit={() => setEditInvoice(invoice)}
                        onDelete={() => setDeleteTarget(invoice)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <CategoryPageBar
          position="bottom"
          pageSizeId="invoice-page-size-bottom"
          paginationLabel="Invoices pagination"
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
        <InvoiceEditModal
          invoice={editInvoice}
          isOpen={Boolean(editInvoice)}
          onClose={() => setEditInvoice(null)}
          onSave={handleUpdate}
        />
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="invoice"
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        <CategoryBulkBar
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
      </div>
    </AdminLayout>
  );
}
