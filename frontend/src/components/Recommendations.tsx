import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa";
import { isCatalogProduct, type CatalogProduct } from "../catalog/types";
import ProductCard from "./ProductCard";
import { Button, EmptyState, Skeleton } from "./ui";

interface RecommendationsProps {
  productId?: number | null;
  limit?: number;
  showTitle?: boolean;
  onAddToCart?: (product: { id: number }) => void | Promise<void>;
}

function Recommendations({
  productId = null,
  limit = 5,
  showTitle = true,
  onAddToCart,
}: RecommendationsProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = productId
        ? `/api/product-views/recommendations/${productId}?limit=${limit}`
        : `/api/product-views/recommendations?limit=${limit}`;
      const response = await axios.get(endpoint);
      const list = response.data?.products;
      setProducts(Array.isArray(list) ? list.filter(isCatalogProduct).slice(0, limit) : []);
      setLoadError(null);
    } catch (error) {
      setProducts([]);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message || "Recommendations could not be loaded."
        : "Recommendations could not be loaded.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, [limit, productId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!loading && !loadError && products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12" aria-labelledby={showTitle ? "recommendations-heading" : undefined}>
      {showTitle ? (
        <h2 id="recommendations-heading" className="mb-6 flex items-center gap-2 text-2xl font-bold text-ink">
          <FaThumbsUp aria-hidden="true" />
          You may also like
        </h2>
      ) : null}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
          <p className="sr-only">Loading recommendations</p>
        </div>
      ) : null}
      {!loading && loadError ? (
        <EmptyState
          title="Recommendations could not be loaded"
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
    </section>
  );
}

export default Recommendations;
