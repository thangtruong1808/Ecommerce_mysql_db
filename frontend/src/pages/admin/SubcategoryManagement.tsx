import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaList } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CategoryBulkBar,
  CategoryPageBar,
  CategorySelectBox,
  CategorySortHeader,
  CategoryToolbar,
} from "../../components/admin/categoryListChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import SubcategoryCreateModal from "../../components/admin/SubcategoryCreateModal";
import SubcategoryEditModal from "../../components/admin/SubcategoryEditModal";
import SubcategoryTableRow from "../../components/admin/SubcategoryTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { useCrudOperations } from "../../utils/useCrudOperations";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";
import { asParents, type ParentOption, type SubcategoryRecord } from "./categoryTree";

const COLUMN_COUNT = 11;

export default function SubcategoryManagement() {
  usePageTitle("Subcategory Management");
  const [subcategories, setSubcategories] = useState<SubcategoryRecord[]>([]);
  const listRef = useRef<SubcategoryRecord[]>([]);
  const [categories, setCategories] = useState<ParentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(subcategories);

  const fetchSubcategories = useCallback(async () => {
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
      if (categoryFilter) {
        params.append("categoryId", categoryFilter);
      }
      const response = await axios.get<{ subcategories?: SubcategoryRecord[]; pagination?: { pages?: number; total?: number } }>(
        `/api/admin/subcategories?${params}`,
      );
      const list = Array.isArray(response.data?.subcategories) ? response.data.subcategories : null;
      if (!list) {
        const message = "Subcategories could not be loaded";
        toast.error(message);
        if (listRef.current.length === 0) {
          setSubcategories([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      listRef.current = list;
      setSubcategories(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(Number(response.data.pagination?.total) || 0);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Subcategories could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (listRef.current.length === 0) {
        setSubcategories([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, entriesPerPage, searchTerm, categoryFilter, sortBy, sortOrder, reloadKey]);

  const crud = useCrudOperations("/api/admin/subcategories", () => {
    void fetchSubcategories();
  });

  useEffect(() => {
    const loadParents = async () => {
      try {
        const response = await axios.get<unknown>("/api/products/categories");
        const list = asParents(response.data);
        if (!list) {
          toast.error("Categories could not be loaded");
          setCategories([]);
          return;
        }
        setCategories(list);
      } catch (loadError: unknown) {
        if (!shouldSuppress401Toast(loadError)) {
          toast.error(messageFrom(loadError, "Categories could not be loaded"));
        }
      }
    };
    void loadParents();
  }, []);

  useEffect(() => {
    void fetchSubcategories();
  }, [fetchSubcategories]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleCreate = async (data: { category_id: string; name: string; description: string; photo: File | null }) => {
    try {
      const formData = new FormData();
      formData.append("category_id", data.category_id);
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.photo) {
        formData.append("photo", data.photo);
      }
      await axios.post("/api/admin/subcategories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Subcategory created successfully");
      crud.setCreateModal({ isOpen: false });
      void fetchSubcategories();
    } catch (createError: unknown) {
      if (!shouldSuppress401Toast(createError)) {
        toast.error(messageFrom(createError, "Failed to create subcategory"));
      }
      throw createError;
    }
  };

  const handleUpdate = async (data: { category_id: string; name: string; description: string }) => {
    const entity = crud.editModal.entity as SubcategoryRecord | null;
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
      await crud.handleBulkDelete(ids, "/api/admin/subcategories/bulk-delete", "subcategoryIds");
      clear();
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && subcategories.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-2">
            <FaList className="shrink-0 text-2xl text-primary" aria-hidden="true" />
            <h1 className="font-ui text-3xl font-semibold">Subcategory Management</h1>
          </div>
          <Button id="add-subcategory" onClick={() => crud.setCreateModal({ isOpen: true })}>Add subcategory</Button>
        </div>
        <CategoryToolbar
          searchId="subcategory-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterId="subcategory-parent-filter"
          filterLabel="Category"
          filterValue={categoryFilter}
          onFilterChange={(value: string) => {
            setCategoryFilter(value);
            setPage(1);
          }}
          filterOptions={[{ value: "", label: "All Categories" }, ...categories.map((category) => ({ value: String(category.id), label: category.name }))]}
          searchPlaceholder="Search subcategories by name, description, or category..."
        />
        <CategoryPageBar position="top" pageSizeId="subcategory-page-size" paginationLabel="Subcategories pagination" currentPage={page} totalPages={totalPages} totalItems={totalItems} entriesPerPage={entriesPerPage} onPageChange={setPage} onEntriesChange={(value: number) => { setEntriesPerPage(value); setPage(1); }} />
        {loading && subcategories.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState title="Subcategories could not be loaded" description={error} action={<Button id="subcategories-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>} />
        ) : null}
        {!showLoadError && !(loading && subcategories.length === 0) ? (
          <div className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <CategorySelectBox
                        pressed={subcategories.length > 0 && selectedCount === subcategories.length}
                        label="Select all subcategories on this page"
                        onClick={() => selectAll(selectedCount < subcategories.length)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">#</th>
                    <CategorySortHeader label="ID Subcategory" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Photo</th>
                    <CategorySortHeader label="Name" field="name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Category" field="category_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Category ID" field="category_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Description" field="description" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {subcategories.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="text-lg font-medium text-muted">{searchTerm ? `No subcategories found matching "${searchTerm}"` : "No subcategories found"}</p>
                      </td>
                    </tr>
                  ) : (
                    subcategories.map((subcategory, index) => (
                      <SubcategoryTableRow
                        key={subcategory.id}
                        subcategory={subcategory}
                        index={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(subcategory.id)}
                        onToggle={toggle}
                        onEdit={() => crud.setEditModal({ isOpen: true, entity: subcategory })}
                        onDelete={() => crud.setDeleteModal({ isOpen: true, entity: subcategory })}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <CategoryPageBar position="bottom" pageSizeId="subcategory-page-size" paginationLabel="Subcategories pagination" currentPage={page} totalPages={totalPages} totalItems={totalItems} entriesPerPage={entriesPerPage} onPageChange={setPage} onEntriesChange={(value: number) => { setEntriesPerPage(value); setPage(1); }} />
        <SubcategoryCreateModal categories={categories} isOpen={crud.createModal.isOpen} onClose={() => crud.setCreateModal({ isOpen: false })} onSave={handleCreate} />
        <SubcategoryEditModal
          subcategory={crud.editModal.entity as SubcategoryRecord | null}
          categories={categories}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="subcategory"
          isOpen={crud.deleteModal.isOpen}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              crud.setDeleteModal({ isOpen: false, entity: null });
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
