import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTags } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CategoryBulkBar,
  CategoryPageBar,
  CategorySelectBox,
  CategorySortHeader,
  CategoryToolbar,
} from "../../components/admin/categoryListChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import CategoryCreateModal from "../../components/admin/CategoryCreateModal";
import CategoryEditModal from "../../components/admin/CategoryEditModal";
import CategoryTableRow from "../../components/admin/CategoryTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { useCrudOperations } from "../../utils/useCrudOperations";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";
import type { CategoryRecord } from "./categoryTree";

const COLUMN_COUNT = 9;

export default function CategoryManagement() {
  usePageTitle("Category Management");
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const categoriesRef = useRef<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(categories);

  const fetchCategories = useCallback(async () => {
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
      const response = await axios.get<{ categories?: CategoryRecord[]; pagination?: { pages?: number; total?: number } }>(
        `/api/admin/categories?${params}`,
      );
      const list = Array.isArray(response.data?.categories) ? response.data.categories : null;
      if (!list) {
        const message = "Categories could not be loaded";
        toast.error(message);
        if (categoriesRef.current.length === 0) {
          setCategories([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      categoriesRef.current = list;
      setCategories(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Categories could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (categoriesRef.current.length === 0) {
        setCategories([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, entriesPerPage, searchTerm, sortBy, sortOrder, reloadKey]);

  const crud = useCrudOperations("/api/admin/categories", () => {
    void fetchCategories();
  });

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (data: { name: string; description: string; photo: File | null }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.photo) {
        formData.append("photo", data.photo);
      }
      await axios.post("/api/admin/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Category created successfully");
      crud.setCreateModal({ isOpen: false });
      void fetchCategories();
    } catch (createError: unknown) {
      if (!shouldSuppress401Toast(createError)) {
        toast.error(messageFrom(createError, "Failed to create category"));
      }
      throw createError;
    }
  };

  const handleUpdate = async (data: { name: string; description: string }) => {
    const entity = crud.editModal.entity as CategoryRecord | null;
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
      await crud.handleBulkDelete(ids, "/api/admin/categories/bulk-delete", "categoryIds");
      clear();
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && categories.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-2">
            <FaTags className="shrink-0 text-2xl text-primary" aria-hidden="true" />
            <h1 className="font-ui text-3xl font-semibold">Category Management</h1>
          </div>
          <Button id="add-category" onClick={() => crud.setCreateModal({ isOpen: true })}>Add category</Button>
        </div>

        <CategoryToolbar
          searchId="category-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search categories by name or description..."
        />
        <CategoryPageBar
          position="top"
          pageSizeId="category-page-size"
          paginationLabel="Categories pagination"
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

        {loading && categories.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Categories could not be loaded"
            description={error}
            action={<Button id="categories-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}

        {!showLoadError && !(loading && categories.length === 0) ? (
          <div className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <CategorySelectBox
                        pressed={categories.length > 0 && selectedCount === categories.length}
                        label="Select all categories on this page"
                        onClick={() => selectAll(selectedCount < categories.length)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">#</th>
                    <CategorySortHeader label="ID Category" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={(field: string, order: string) => { setSortBy(field); setSortOrder(order); setPage(1); }} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Photo</th>
                    <CategorySortHeader label="Name" field="name" currentSort={sortBy} sortOrder={sortOrder} onSort={(field: string, order: string) => { setSortBy(field); setSortOrder(order); setPage(1); }} />
                    <CategorySortHeader label="Description" field="description" currentSort={sortBy} sortOrder={sortOrder} onSort={(field: string, order: string) => { setSortBy(field); setSortOrder(order); setPage(1); }} />
                    <CategorySortHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={(field: string, order: string) => { setSortBy(field); setSortOrder(order); setPage(1); }} />
                    <CategorySortHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={(field: string, order: string) => { setSortBy(field); setSortOrder(order); setPage(1); }} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {categories.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="text-lg font-medium text-muted">{searchTerm ? `No categories found matching "${searchTerm}"` : "No categories found"}</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, index) => (
                      <CategoryTableRow
                        key={category.id}
                        category={category}
                        index={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(category.id)}
                        onToggle={toggle}
                        onEdit={() => crud.setEditModal({ isOpen: true, entity: category })}
                        onDelete={() => crud.setDeleteModal({ isOpen: true, entity: category })}
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
          pageSizeId="category-page-size"
          paginationLabel="Categories pagination"
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

        <CategoryCreateModal isOpen={crud.createModal.isOpen} onClose={() => crud.setCreateModal({ isOpen: false })} onSave={handleCreate} />
        <CategoryEditModal
          category={crud.editModal.entity as CategoryRecord | null}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="category"
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
