import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { isCatalogProduct, type CatalogProduct } from "../catalog/types";
import ProductCard from "./ProductCard";
import { Button, EmptyState, Modal, Skeleton } from "./ui";

interface RecentlyViewedProps {
  limit?: number;
  showTitle?: boolean;
  refreshKey?: number | string | null;
  onAddToCart?: (product: { id: number }) => void | Promise<void>;
}

function RecentlyViewed({
  limit = 5,
  showTitle = true,
  refreshKey = null,
  onAddToCart,
}: RecentlyViewedProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/product-views/recent?limit=${limit}`);
      const list = response.data?.products;
      setProducts(Array.isArray(list) ? list.filter(isCatalogProduct).slice(0, limit) : []);
      setLoadError(null);
    } catch (error) {
      setProducts([]);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message || "Recently viewed items could not be loaded."
        : "Recently viewed items could not be loaded.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const clearHistory = async () => {
    setClearing(true);
    try {
      await axios.delete("/api/product-views/recent");
      setProducts([]);
      setConfirmOpen(false);
      toast.success("Recently viewed history cleared");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message || "Failed to clear history"
        : "Failed to clear history";
      toast.error(message);
    } finally {
      setClearing(false);
    }
  };

  if (!loading && !loadError && products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12" aria-labelledby={showTitle ? "recently-viewed-heading" : undefined}>
      {showTitle ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="recently-viewed-heading" className="flex items-center gap-2 text-2xl font-bold text-ink">
            <FaEye aria-hidden="true" />
            Your recently viewed items
          </h2>
          {products.length > 0 ? (
            <Button type="button" variant="outline" size="sm" disabled={clearing} onClick={() => setConfirmOpen(true)}>
              Clear history
            </Button>
          ) : null}
        </div>
      ) : null}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
          <p className="sr-only">Loading recently viewed items</p>
        </div>
      ) : null}
      {!loading && loadError ? (
        <EmptyState
          title="Recently viewed items could not be loaded"
          description={loadError}
          action={
            <Button type="button" onClick={() => void load()}>
              Try again
            </Button>
          }
        />
      ) : null}
      {!loading && !loadError && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : null}
      <Modal
        open={confirmOpen}
        title="Clear history"
        description="This removes every product from your recently viewed list."
        onClose={() => {
          if (!clearing) {
            setConfirmOpen(false);
          }
        }}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={clearing} onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={clearing} onClick={() => void clearHistory()}>
            Clear history
          </Button>
        </div>
      </Modal>
    </section>
  );
}

export default RecentlyViewed;
