import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import { CategoryBulkBar, CategoryToolbar } from "../../components/admin/categoryListChrome";
import { MediaPageBar } from "../../components/admin/mediaLibraryChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import ImageLightbox from "../../components/admin/ImageLightbox";
import ImageTableRow, { type AdminImage } from "../../components/admin/ImageTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import { focusRing } from "../../components/ui/styles";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { deleteImage, setPrimaryImage } from "../../utils/mediaApi";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

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
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex min-w-0 items-center gap-2 border-b border-line pb-4">
          <FaImage className="shrink-0 text-2xl text-primary" aria-hidden="true" />
          <h1 className="font-ui text-3xl font-semibold">Image Management</h1>
        </div>
        <CategoryToolbar
          searchId="image-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterId="image-product-filter"
          filterLabel="Product"
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
          <div aria-busy={loading || undefined}>
            {images.length === 0 && !loading ? (
              <p className="rounded-ui-lg border border-line bg-surface px-6 py-12 text-center font-ui text-lg font-medium text-muted shadow-ui">
                {searchTerm ? `No images found matching "${searchTerm}"` : "No images found"}
              </p>
            ) : (
              <>
                <div className="mb-3">
                  <button
                    type="button"
                    className={`rounded-ui-sm font-ui text-sm font-semibold text-primary hover:text-primary-hover ${focusRing}`}
                    onClick={() => selectAll(selectedCount < images.length)}
                  >
                    {images.length > 0 && selectedCount === images.length ? "Clear page selection" : "Select page"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {images.map((image) => (
                    <ImageTableRow
                      key={image.id}
                      image={image}
                      isSelected={selected.has(image.id)}
                      onToggle={toggle}
                      onView={() => setLightboxImage(image)}
                      onSetPrimary={(imageId) => { void handleSetPrimary(imageId); }}
                      onDelete={(imageId) => setDeleteTarget(images.find((item) => item.id === imageId) || null)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
        <MediaPageBar currentPage={page} totalPages={totalPages} label="Images pagination" onPageChange={setPage} />
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
