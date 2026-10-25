import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import Pagination from "../../components/admin/Pagination";
import BulkSelectCheckbox from "../../components/admin/BulkSelectCheckbox";
import BulkActionBar from "../../components/admin/BulkActionBar";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import ImageLightbox from "../../components/admin/ImageLightbox";
import ImageTableRow, { type AdminImage } from "../../components/admin/ImageTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { deleteImage, setPrimaryImage } from "../../utils/mediaApi";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 7;

export default function ImageManagement() {
  usePageTitle("Image Management");
  const [images, setImages] = useState<AdminImage[]>([]);
  const imagesRef = useRef<AdminImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminImage | null>(null);
  const [lightboxImage, setLightboxImage] = useState<AdminImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(images);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (productFilter) {
        params.append("productId", productFilter);
      }
      const response = await axios.get<{ images?: AdminImage[]; pagination?: { pages?: number } }>(`/api/admin/images?${params}`);
      const list = Array.isArray(response.data?.images) ? response.data.images : null;
      if (!list) {
        const message = "Images could not be loaded";
        toast.error(message);
        if (imagesRef.current.length === 0) {
          setImages([]);
          setTotalPages(1);
          setError(message);
        }
        return;
      }
      imagesRef.current = list;
      setImages(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Images could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (imagesRef.current.length === 0) {
        setImages([]);
        setTotalPages(1);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, productFilter, reloadKey]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await deleteImage(deleteTarget.id);
      setDeleteTarget(null);
      await fetchImages();
    } finally {
      setDeleting(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    const image = images.find((item) => item.id === imageId);
    if (!image) {
      return;
    }
    await setPrimaryImage(image.product_id, imageId);
    await fetchImages();
  };

  const handleBulkDelete = async () => {
    if (bulkBusy) {
      return;
    }
    setBulkBusy(true);
    try {
      for (const id of Array.from(selected).map((value) => Number(value))) {
        await deleteImage(id);
      }
      clear();
      await fetchImages();
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && images.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-full text-ink">
        <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
          <FaImage className="text-2xl text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Image Management</h1>
        </div>
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterValue={productFilter}
          onFilterChange={(value: string) => {
            setProductFilter(value);
            setPage(1);
          }}
          filterOptions={[{ value: "", label: "All Products" }]}
          searchPlaceholder="Search by product name or image URL..."
        />
        {loading && images.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState title="Images could not be loaded" description={error} action={<Button id="images-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>} />
        ) : null}
        {!showLoadError && !(loading && images.length === 0) ? (
          <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-6 py-3 text-left"><BulkSelectCheckbox isSelectAll totalItems={images.length} selectedCount={selectedCount} onSelectAll={selectAll} /></th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Primary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {images.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center text-lg font-medium text-muted">
                        {searchTerm ? `No images found matching "${searchTerm}"` : "No images found"}
                      </td>
                    </tr>
                  ) : (
                    images.map((image) => (
                      <ImageTableRow
                        key={image.id}
                        image={image}
                        isSelected={selected.has(image.id)}
                        onToggle={toggle}
                        onView={() => setLightboxImage(image)}
                        onSetPrimary={(imageId) => { void handleSetPrimary(imageId); }}
                        onDelete={(imageId) => setDeleteTarget(images.find((item) => item.id === imageId) || null)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="image"
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
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
