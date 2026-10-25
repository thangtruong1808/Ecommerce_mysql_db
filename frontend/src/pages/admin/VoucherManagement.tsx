import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTag } from "react-icons/fa";
import type { Voucher } from "@shared/commerce";
import AdminLayout from "../../components/admin/AdminLayout";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import SortableTableHeader from "../../components/admin/SortableTableHeader";
import VoucherCreateModal from "../../components/admin/VoucherCreateModal";
import VoucherEditModal from "../../components/admin/VoucherEditModal";
import VoucherTableRow from "../../components/admin/VoucherTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { useCrudOperations } from "../../utils/useCrudOperations";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";
import { matchesVoucherFilter, sortVouchers, type VoucherInput } from "./voucherForm";

const COLUMN_COUNT = 9;

interface VouchersResponse {
  vouchers?: Voucher[];
  pagination?: { pages?: number; total?: number };
}

export default function VoucherManagement() {
  usePageTitle("Voucher Management");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const vouchersRef = useRef<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(vouchers);
  const requestId = useRef(0);

  const fetchVouchers = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(entriesPerPage),
      });
      const response = await axios.get<VouchersResponse>(`/api/vouchers/admin/all?${params}`);
      const list = Array.isArray(response.data?.vouchers) ? response.data.vouchers : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Vouchers could not be loaded";
        toast.error(message);
        if (vouchersRef.current.length === 0) {
          setVouchers([]);
          setTotalPages(1);
          setServerTotal(0);
          setError(message);
        }
        return;
      }
      vouchersRef.current = list;
      setVouchers(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setServerTotal(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Vouchers could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (vouchersRef.current.length === 0) {
        setVouchers([]);
        setTotalPages(1);
        setServerTotal(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, reloadKey]);

  const crud = useCrudOperations("/api/vouchers", fetchVouchers);

  useEffect(() => {
    void fetchVouchers();
  }, [fetchVouchers]);

  const visible = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = vouchers.filter((voucher) => {
      const matchesSearch = !term || voucher.code.toLowerCase().includes(term);
      return matchesSearch && matchesVoucherFilter(voucher, statusFilter);
    });
    return sortVouchers(filtered, sortBy, sortOrder);
  }, [vouchers, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleCreate = async (data: VoucherInput) => {
    await crud.handleCreate({ ...data });
  };

  const handleUpdate = async (data: VoucherInput) => {
    const id = Number(crud.editModal.entity?.id);
    if (!id) {
      return;
    }
    await crud.handleUpdate(id, { ...data });
  };

  const handleDeleteConfirm = async () => {
    if (deleting) {
      return;
    }
    setDeleting(true);
    try {
      await crud.handleDeleteConfirm();
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (bulkBusy) {
      return;
    }
    const ids = Array.from(selected).map((id) => Number(id));
    setBulkBusy(true);
    try {
      for (const id of ids) {
        await axios.put(`/api/admin/vouchers/${id}/status`, { isActive });
      }
      toast.success(`${ids.length} voucher(s) ${isActive ? "activated" : "deactivated"}`);
      clear();
      await fetchVouchers();
    } catch (updateError: unknown) {
      if (!shouldSuppress401Toast(updateError)) {
        toast.error(messageFrom(updateError, "Failed to update vouchers"));
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && vouchers.length === 0;
  const filtered = Boolean(searchTerm.trim() || statusFilter);
  const totalItems = filtered ? visible.length : serverTotal;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-full text-ink">
        <div className="mb-4 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FaTag className="text-2xl text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Voucher Management</h1>
          </div>
          <Button id="create-voucher" onClick={() => crud.setCreateModal({ isOpen: true })}>
            <FaPlus aria-hidden="true" />
            Create voucher
          </Button>
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
            { value: "", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "expired", label: "Expired" },
          ]}
          searchPlaceholder="Search vouchers by code..."
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
        {loading && vouchers.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Vouchers could not be loaded"
            description={error}
            action={<Button id="vouchers-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && vouchers.length === 0) ? (
          <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <BulkSelectCheckbox isSelectAll totalItems={visible.length} selectedCount={selectedCount} onSelectAll={selectAll} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">#</th>
                    <SortableTableHeader label="Code" field="code" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Type" field="discount_type" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Value" field="discount_value" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Valid Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {visible.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center text-lg font-medium text-muted">
                        {searchTerm ? `No vouchers found matching "${searchTerm}"` : "No vouchers found"}
                      </td>
                    </tr>
                  ) : (
                    visible.map((voucher, index) => (
                      <VoucherTableRow
                        key={voucher.id}
                        voucher={voucher}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(voucher.id)}
                        onToggle={toggle}
                        onEdit={() => crud.setEditModal({ isOpen: true, entity: voucher })}
                        onDelete={() => crud.setDeleteModal({ isOpen: true, entity: voucher })}
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
        <VoucherCreateModal
          isOpen={crud.createModal.isOpen}
          onClose={() => crud.setCreateModal({ isOpen: false })}
          onSave={handleCreate}
        />
        <VoucherEditModal
          voucher={crud.editModal.entity}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="voucher"
          isOpen={crud.deleteModal.isOpen}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              crud.setDeleteModal({ isOpen: false, entity: null });
            }
          }}
        />
        {selectedCount > 0 ? (
          <BulkActionBar
            selectedCount={selectedCount}
            busy={bulkBusy}
            actions={[
              { type: "activate", label: "Activate Selected" },
              { type: "deactivate", label: "Deactivate Selected" },
            ]}
            onAction={(actionType: string) => {
              if (actionType === "activate") {
                void handleBulkStatus(true);
              }
              if (actionType === "deactivate") {
                void handleBulkStatus(false);
              }
            }}
            onCancel={clear}
          />
        ) : null}
      </div>
    </AdminLayout>
  );
}
