/**
 * Invoice Management Page
 * Full CRUD operations for invoices with filters, search, pagination
 *
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileInvoice } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import SkeletonLoader from "../../components/SkeletonLoader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import SortableTableHeader from "../../components/admin/SortableTableHeader";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import InvoiceEditModal from "../../components/admin/InvoiceEditModal";
import InvoiceTableRow from "../../components/admin/InvoiceTableRow";
import { useSelection } from "../../utils/useSelection";
import usePageTitle from "../../hooks/usePageTitle";

/**
 * InvoiceManagement component
 * @returns {JSX.Element} Invoice management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  usePageTitle(loading ? "Loading..." : "Invoice Management");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    invoice: null,
  });
  const [editModal, setEditModal] = useState({ isOpen: false, invoice: null });
  const {
    selected: selectedInvoices,
    toggle,
    selectAll,
    clear,
    selectedCount,
  } = useSelection(invoices);

  /**
   * Fetch invoices with search and filters
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: entriesPerPage,
        sortBy,
        sortOrder,
      });
      if (searchTerm) params.append("search", String(searchTerm));
      if (statusFilter) params.append("paymentStatus", statusFilter);
      const response = await axios.get(`/api/admin/invoices?${params}`);
      const pagination = response.data?.pagination || {
        page: 1,
        limit: entriesPerPage,
        total: 0,
        pages: 1,
      };
      if (response.data && response.data.invoices) {
        setInvoices(response.data.invoices || []);
        setTotalPages(pagination.pages || 1);
        setTotalItems(pagination.total || 0);
      } else {
        setInvoices([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      setInitialLoad(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "No invoices found matching your search";
      toast.error(errorMessage);
      setInvoices([]);
      setTotalPages(1);
      setTotalItems(0);
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, entriesPerPage, searchTerm, statusFilter, sortBy, sortOrder]);

  /**
   * Handle sort
   * @param {string} field - Sort field
   * @param {string} order - Sort order
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  /**
   * Handle update invoice
   * @param {Object} data - Invoice data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/admin/invoices/${editModal.invoice.id}`, data);
      toast.success("Invoice updated successfully");
      setEditModal({ isOpen: false, invoice: null });
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update invoice");
    }
  };

  /**
   * Handle resend email
   * @param {number} invoiceId - Invoice ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleResendEmail = async (invoiceId) => {
    try {
      await axios.post(`/api/admin/invoices/${invoiceId}/resend-email`);
      toast.success("Invoice email sent successfully");
      fetchInvoices();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send invoice email"
      );
    }
  };

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/invoices/${deleteModal.invoice.id}`);
      toast.success("Invoice deleted successfully");
      setDeleteModal({ isOpen: false, invoice: null });
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    }
  };

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedInvoices);
      await axios.post("/api/admin/invoices/bulk-delete", { invoiceIds: ids });
      toast.success(`${ids.length} invoice(s) deleted successfully`);
      clear();
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete invoices");
    }
  };

  if (loading && initialLoad && invoices.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Invoice Management
          </h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    );
  }

  /* Invoice management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaFileInvoice className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">
              Invoice Management
            </h1>
          </div>
        </div>

        {/* Divider between header and filters */}
        <div className="my-2 mb-4">
          <hr />
        </div>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterValue={statusFilter}
          onFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Statuses" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
          ]}
          searchPlaceholder="Search by invoice number, order number, user name, or email..."
        />

        {/* Pagination top */}
        <Pagination
          position="top"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value) => {
            setEntriesPerPage(value);
            setPage(1);
          }}
        />

        {/* Invoices table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <BulkSelectCheckbox
                      isSelectAll
                      totalItems={invoices.length}
                      selectedCount={selectedCount}
                      onSelectAll={selectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <SortableTableHeader
                    label="ID Invoice"
                    field="id"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Invoice Number"
                    field="invoice_number"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Order ID"
                    field="order_id"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Order Number"
                    field="order_number"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="User ID"
                    field="user_id"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="User"
                    field="user_name"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Subtotal"
                    field="subtotal"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Tax"
                    field="tax_amount"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Shipping"
                    field="shipping_amount"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Total"
                    field="total_amount"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Payment Method"
                    field="payment_method"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Payment Status"
                    field="payment_status"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Email Sent"
                    field="email_sent"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Email Sent At"
                    field="email_sent_at"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Created"
                    field="created_at"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="13" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-500 text-lg font-medium">
                          {searchTerm
                            ? `No invoices found matching "${searchTerm}"`
                            : "No invoices found"}
                        </p>
                        {searchTerm && (
                          <p className="text-gray-400 text-sm mt-2">
                            Try adjusting your search terms or clear the search
                            to see all invoices.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => (
                    <InvoiceTableRow
                      key={invoice.id}
                      invoice={invoice}
                      index={(page - 1) * entriesPerPage + index + 1}
                      isSelected={selectedInvoices.has(invoice.id)}
                      onToggle={toggle}
                      onResendEmail={() => handleResendEmail(invoice.id)}
                      onEdit={() => setEditModal({ isOpen: true, invoice })}
                      onDelete={() => setDeleteModal({ isOpen: true, invoice })}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination bottom */}
        <Pagination
          position="bottom"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value) => {
            setEntriesPerPage(value);
            setPage(1);
          }}
        />

        {/* Edit modal */}
        <InvoiceEditModal
          invoice={editModal.invoice}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, invoice: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.invoice}
          entityType="invoice"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, invoice: null })}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[{ type: "delete", label: "Delete Selected" }]}
            onAction={(actionType) =>
              actionType === "delete" && handleBulkDelete()
            }
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default InvoiceManagement;
