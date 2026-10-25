import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLayerGroup } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import SortableTableHeader from "../../components/admin/SortableTableHeader";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import ChildCategoryCreateModal from "../../components/admin/ChildCategoryCreateModal";
import ChildCategoryEditModal from "../../components/admin/ChildCategoryEditModal";
import ChildCategoryTableRow from "../../components/admin/ChildCategoryTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { useCrudOperations } from "../../utils/useCrudOperations";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";
import { asParents, type ChildCategoryRecord, type ParentOption } from "./categoryTree";

const COLUMN_COUNT = 11;

export default function ChildCategoryManagement() {
  usePageTitle("Child Category Management");
  const [childCategories, setChildCategories] = useState<ChildCategoryRecord[]>([]);
  const listRef = useRef<ChildCategoryRecord[]>([]);
  const [subcategories, setSubcategories] = useState<ParentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(childCategories);

  const fetchChildCategories = useCallback(async () => {
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
      if (subcategoryFilter) {
        params.append("subcategoryId", subcategoryFilter);
      }
      const response = await axios.get<{ childCategories?: ChildCategoryRecord[]; pagination?: { pages?: number; total?: number } }>(
        `/api/admin/child-categories?${params}`,
      );
      const list = Array.isArray(response.data?.childCategories) ? response.data.childCategories : null;
      if (!list) {
        const message = "Child categories could not be loaded";
        toast.error(message);
        if (listRef.current.length === 0) {
          setChildCategories([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      listRef.current = list;
      setChildCategories(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(Number(response.data.pagination?.total) || 0);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Child categories could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (listRef.current.length === 0) {
        setChildCategories([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, entriesPerPage, searchTerm, subcategoryFilter, sortBy, sortOrder, reloadKey]);

  const crud = useCrudOperations("/api/admin/child-categories", () => {
    void fetchChildCategories();
  });

  useEffect(() => {
    const loadParents = async () => {
      try {
        const response = await axios.get<unknown>("/api/products/subcategories");
        const list = asParents(response.data);
        if (!list) {
          toast.error("Subcategories could not be loaded");
          setSubcategories([]);
          return;
        }
        setSubcategories(list);
      } catch (loadError: unknown) {
        if (!shouldSuppress401Toast(loadError)) {
          toast.error(messageFrom(loadError, "Subcategories could not be loaded"));
        }
      }
    };
    void loadParents();
  }, []);

  useEffect(() => {
    void fetchChildCategories();
  }, [fetchChildCategories]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleUpdate = async (data: { subcategory_id: string; name: string; description: string }) => {
    const entity = crud.editModal.entity as ChildCategoryRecord | null;
    if (!entity) {
      return;
    }
    await crud.handleUpdate(entity.id, data);
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

  const handleBulkDelete = async () => {
    if (bulkBusy) {
      return;
    }
    setBulkBusy(true);
    try {
      const ids = Array.from(selected).map((id) => Number(id));
      await crud.handleBulkDelete(ids, "/api/admin/child-categories/bulk-delete", "childCategoryIds");
      clear();
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && childCategories.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-full text-ink">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 border-b border-line pb-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <FaLayerGroup className="text-2xl text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Child Category Management</h1>
          </div>
          <Button id="add-child-category" onClick={() => crud.setCreateModal({ isOpen: true })}>Add child category</Button>
        </div>
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterValue={subcategoryFilter}
          onFilterChange={(value: string) => {
            setSubcategoryFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Subcategories" },
            ...subcategories.map((subcategory) => ({
              value: String(subcategory.id),
              label: subcategory.category_name ? `${subcategory.category_name} - ${subcategory.name}` : subcategory.name,
            })),
          ]}
          searchPlaceholder="Search child categories by name, description, category, or subcategory..."
        />
        <Pagination position="top" currentPage={page} totalPages={totalPages} totalItems={totalItems} entriesPerPage={entriesPerPage} onPageChange={setPage} onEntriesChange={(value: number) => { setEntriesPerPage(value); setPage(1); }} />
        {loading && childCategories.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState title="Child categories could not be loaded" description={error} action={<Button id="child-categories-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>} />
        ) : null}
        {!showLoadError && !(loading && childCategories.length === 0) ? (
          <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-6 py-3 text-left"><BulkSelectCheckbox isSelectAll totalItems={childCategories.length} selectedCount={selectedCount} onSelectAll={selectAll} /></th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">#</th>
                    <SortableTableHeader label="ID Child Category" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Name" field="name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Category" field="category_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Subcategory" field="subcategory_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Subcategory ID" field="subcategory_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Description" field="description" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableTableHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {childCategories.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="text-lg font-medium text-muted">{searchTerm ? `No child categories found matching "${searchTerm}"` : "No child categories found"}</p>
                      </td>
                    </tr>
                  ) : (
                    childCategories.map((childCategory, index) => (
                      <ChildCategoryTableRow
                        key={childCategory.id}
                        childCategory={childCategory}
                        index={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(childCategory.id)}
                        onToggle={toggle}
                        onEdit={() => crud.setEditModal({ isOpen: true, entity: childCategory })}
                        onDelete={() => crud.setDeleteModal({ isOpen: true, entity: childCategory })}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <Pagination position="bottom" currentPage={page} totalPages={totalPages} totalItems={totalItems} entriesPerPage={entriesPerPage} onPageChange={setPage} onEntriesChange={(value: number) => { setEntriesPerPage(value); setPage(1); }} />
        <ChildCategoryCreateModal subcategories={subcategories} isOpen={crud.createModal.isOpen} onClose={() => crud.setCreateModal({ isOpen: false })} onSave={crud.handleCreate} />
        <ChildCategoryEditModal
          childCategory={crud.editModal.entity as ChildCategoryRecord | null}
          subcategories={subcategories}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="child category"
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
