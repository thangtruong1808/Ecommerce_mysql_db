import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImages } from "react-icons/fa";
import type { Product } from "@shared/catalog";
import type { ProductMedia } from "@shared/media";
import AdminLayout from "../../components/admin/AdminLayout";
import MediaUploader from "../../components/admin/MediaUploader";
import MediaGallery from "../../components/admin/MediaGallery";
import VideoList from "../../components/admin/VideoList";
import VideoEditModal from "../../components/admin/VideoEditModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import { Button, EmptyState, Skeleton, Tabs } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import {
  getProductMedia,
  uploadProductImages,
  uploadProductVideo,
  deleteImage,
  deleteVideo,
  setPrimaryImage,
  setPrimaryVideo,
  updateVideo,
} from "../../utils/mediaApi";
import { messageFrom } from "./dashboardFormat";
import type { VideoEditInput } from "../../components/admin/VideoEditModal";
import type { ProductImage, ProductVideo } from "@shared/catalog";

interface DeleteTarget {
  kind: "image" | "video";
  id: number;
  name: string;
}

export default function MediaManagement() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [tab, setTab] = useState("images");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [editVideo, setEditVideo] = useState<ProductVideo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [acting, setActing] = useState(false);
  usePageTitle("Media Management");

  const fetchData = useCallback(async () => {
    const id = Number(productId);
    if (!Number.isFinite(id)) {
      setError("This product could not be found");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [productRes, mediaRes] = await Promise.all([
        axios.get<Product>(`/api/products/${id}`),
        getProductMedia(id) as Promise<ProductMedia>,
      ]);
      const nextImages = Array.isArray(mediaRes?.images) ? mediaRes.images : null;
      const nextVideos = Array.isArray(mediaRes?.videos) ? mediaRes.videos : null;
      if (!nextImages || !nextVideos) {
        setError("Product media could not be loaded");
        return;
      }
      setProduct(productRes.data);
      setImages(nextImages);
      setVideos(nextVideos);
      setError("");
    } catch (loadError: unknown) {
      const message = messageFrom(loadError, "Product media could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [productId, reloadKey]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const run = async (work: () => Promise<unknown>) => {
    if (acting) {
      return;
    }
    setActing(true);
    try {
      await work();
      await fetchData();
    } finally {
      setActing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      if (deleteTarget.kind === "image") {
        await deleteImage(deleteTarget.id);
      } else {
        await deleteVideo(deleteTarget.id);
      }
      setDeleteTarget(null);
      await fetchData();
    } finally {
      setDeleting(false);
    }
  };

  const saveVideo = async (data: VideoEditInput) => {
    if (!editVideo) {
      return;
    }
    await updateVideo(editVideo.id, data);
    setEditVideo(null);
    await fetchData();
  };

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-2">
            <FaImages className="shrink-0 text-2xl text-primary" aria-hidden="true" />
            <h1 className="min-w-0 break-words font-ui text-3xl font-semibold">Media — {product?.name || "Product"}</h1>
          </div>
          <Button id="back-to-products" variant="outline" onClick={() => navigate("/admin/products")}>Back to products</Button>
        </div>

        {loading && !product ? <Skeleton className="h-96" /> : null}
        {error && !product && !loading ? (
          <EmptyState
            title="Product media could not be loaded"
            description={error}
            action={
              <Button id="media-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>
            }
          />
        ) : null}

        {product ? (
          <Tabs
            label="Product media"
            value={tab}
            onChange={setTab}
            tabs={[
              {
                id: "images",
                label: `Images (${images.length})`,
                panel: (
                  <div className="space-y-6">
                    <MediaUploader
                      onUpload={(files) => run(() => uploadProductImages(Number(productId), files))}
                      accept="image/*"
                      maxSize={5}
                      maxFiles={10}
                      multiple
                    />
                    <MediaGallery
                      images={images}
                      busy={acting}
                      onSetPrimary={(imageId) => { void run(() => setPrimaryImage(Number(productId), imageId)); }}
                      onDelete={(imageId) => setDeleteTarget({ kind: "image", id: imageId, name: `Image ${imageId}` })}
                    />
                  </div>
                ),
              },
              {
                id: "videos",
                label: `Videos (${videos.length})`,
                panel: (
                  <div className="space-y-6">
                    <MediaUploader
                      onUpload={(files) => {
                        const file = files[0];
                        if (!file) {
                          return Promise.resolve();
                        }
                        return run(() => uploadProductVideo(Number(productId), file));
                      }}
                      accept="video/*"
                      maxSize={100}
                      maxFiles={1}
                      multiple={false}
                    />
                    <VideoList
                      videos={videos}
                      busy={acting}
                      onSetPrimary={(videoId) => { void run(() => setPrimaryVideo(Number(productId), videoId)); }}
                      onDelete={(videoId) => setDeleteTarget({ kind: "video", id: videoId, name: videos.find((video) => video.id === videoId)?.title || `Video ${videoId}` })}
                      onEdit={setEditVideo}
                    />
                  </div>
                ),
              },
            ]}
          />
        ) : null}

        <ConfirmDeleteModal
          entity={deleteTarget ? { id: deleteTarget.id, name: deleteTarget.name } : null}
          entityType={deleteTarget?.kind || "file"}
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        <VideoEditModal video={editVideo} isOpen={Boolean(editVideo)} onClose={() => setEditVideo(null)} onSave={saveVideo} />
      </div>
    </AdminLayout>
  );
}
