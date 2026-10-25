import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaVideo } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import { CategoryBulkBar, CategoryToolbar } from "../../components/admin/categoryListChrome";
import { MediaPageBar } from "../../components/admin/mediaLibraryChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import VideoEditModal, { type VideoEditInput } from "../../components/admin/VideoEditModal";
import VideoTableRow, { type AdminVideo } from "../../components/admin/VideoTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import { focusRing } from "../../components/ui/styles";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { deleteVideo, setPrimaryVideo, updateVideo } from "../../utils/mediaApi";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

export default function VideoManagement() {
  usePageTitle("Video Management");
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const videosRef = useRef<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminVideo | null>(null);
  const [editVideo, setEditVideo] = useState<AdminVideo | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(videos);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (productFilter) {
        params.append("productId", productFilter);
      }
      const response = await axios.get<{ videos?: AdminVideo[]; pagination?: { pages?: number } }>(`/api/admin/videos?${params}`);
      const list = Array.isArray(response.data?.videos) ? response.data.videos : null;
      if (!list) {
        const message = "Videos could not be loaded";
        toast.error(message);
        if (videosRef.current.length === 0) {
          setVideos([]);
          setTotalPages(1);
          setError(message);
        }
        return;
      }
      videosRef.current = list;
      setVideos(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Videos could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (videosRef.current.length === 0) {
        setVideos([]);
        setTotalPages(1);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, productFilter, reloadKey]);

  useEffect(() => {
    void fetchVideos();
  }, [fetchVideos]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await deleteVideo(deleteTarget.id);
      setDeleteTarget(null);
      await fetchVideos();
    } finally {
      setDeleting(false);
    }
  };

  const handleSetPrimary = async (videoId: number) => {
    const video = videos.find((item) => item.id === videoId);
    if (!video) {
      return;
    }
    await setPrimaryVideo(video.product_id, videoId);
    await fetchVideos();
  };

  const handleBulkDelete = async () => {
    if (bulkBusy) {
      return;
    }
    setBulkBusy(true);
    try {
      for (const id of Array.from(selected).map((value) => Number(value))) {
        await deleteVideo(id);
      }
      clear();
      await fetchVideos();
    } finally {
      setBulkBusy(false);
    }
  };

  const handleVideoUpdate = async (data: VideoEditInput) => {
    if (!editVideo) {
      return;
    }
    await updateVideo(editVideo.id, data);
    setEditVideo(null);
    await fetchVideos();
  };

  const showLoadError = Boolean(error) && videos.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex min-w-0 items-center gap-2 border-b border-line pb-4">
          <FaVideo className="shrink-0 text-2xl text-primary" aria-hidden="true" />
          <h1 className="font-ui text-3xl font-semibold">Video Management</h1>
        </div>
        <CategoryToolbar
          searchId="video-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          filterId="video-product-filter"
          filterLabel="Product"
          filterValue={productFilter}
          onFilterChange={(value: string) => {
            setProductFilter(value);
            setPage(1);
          }}
          filterOptions={[{ value: "", label: "All Products" }]}
          searchPlaceholder="Search by product name, title, or video URL..."
        />
        {loading && videos.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState title="Videos could not be loaded" description={error} action={<Button id="videos-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>} />
        ) : null}
        {!showLoadError && !(loading && videos.length === 0) ? (
          <div aria-busy={loading || undefined}>
            {videos.length === 0 && !loading ? (
              <p className="rounded-ui-lg border border-line bg-surface px-6 py-12 text-center font-ui text-lg font-medium text-muted shadow-ui">
                {searchTerm ? `No videos found matching "${searchTerm}"` : "No videos found"}
              </p>
            ) : (
              <>
                <div className="mb-3">
                  <button
                    type="button"
                    className={`rounded-ui-sm font-ui text-sm font-semibold text-primary hover:text-primary-hover ${focusRing}`}
                    onClick={() => selectAll(selectedCount < videos.length)}
                  >
                    {videos.length > 0 && selectedCount === videos.length ? "Clear page selection" : "Select page"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {videos.map((video) => (
                    <VideoTableRow
                      key={video.id}
                      video={video}
                      isSelected={selected.has(video.id)}
                      isPlaying={playingId === video.id}
                      onToggle={toggle}
                      onPlay={setPlayingId}
                      onEdit={setEditVideo}
                      onSetPrimary={(videoId) => { void handleSetPrimary(videoId); }}
                      onDelete={(videoId) => setDeleteTarget(videos.find((item) => item.id === videoId) || null)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
        <MediaPageBar currentPage={page} totalPages={totalPages} label="Videos pagination" onPageChange={setPage} />
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="video"
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        <VideoEditModal video={editVideo} isOpen={Boolean(editVideo)} onClose={() => setEditVideo(null)} onSave={handleVideoUpdate} />
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
