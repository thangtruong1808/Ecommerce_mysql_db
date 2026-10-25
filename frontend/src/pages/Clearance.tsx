import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTag } from "react-icons/fa";
import { isCatalogProduct, type CatalogPagination, type CatalogProduct } from "../catalog/types";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { Button, EmptyState, Select, Skeleton } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import usePageTitle from "../hooks/usePageTitle";

interface ClearanceFilters {
  sortBy: string;
  sortOrder: string;
  page: number;
}

const emptyPagination: CatalogPagination = { page: 1, pages: 1, total: 0, limit: 15 };

function Clearance() {
  usePageTitle("Clearance Sale");
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("categoryName")
    ? decodeURIComponent(searchParams.get("categoryName") || "")
    : null;
  const { addToCart } = useCart() as {
    addToCart: (productId: number, quantity?: number) => Promise<{ success?: boolean; error?: string }>;
  };
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<CatalogPagination>(emptyPagination);
  const [filters, setFilters] = useState<ClearanceFilters>({
    sortBy: "created_at",
    sortOrder: "DESC",
    page: 1,
  });

  useEffect(() => {
    setFilters((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, [categoryId]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("sortBy", filters.sortBy);
        params.append("sortOrder", filters.sortOrder);
        if (categoryId) params.append("category", categoryId);
        params.append("page", String(filters.page));
        params.append("limit", "15");
        const response = await axios.get(`/api/products/clearance?${params}`);
        if (ignore) {
          return;
        }
        const body = response.data as { products?: unknown; pagination?: Partial<CatalogPagination> };
        const list = Array.isArray(body?.products) ? body.products.filter(isCatalogProduct) : null;
        if (!list) {
          setProducts([]);
          setPagination(emptyPagination);
          setLoadError("Clearance products could not be loaded.");
          return;
        }
        setProducts(list);
        setPagination({
          page: Number(body.pagination?.page) || filters.page,
          pages: Number(body.pagination?.pages) || 1,
          total: Number(body.pagination?.total) || list.length,
          limit: Number(body.pagination?.limit) || 15,
        });
        setLoadError(null);
      } catch (error) {
        if (ignore) {
          return;
        }
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message || "Failed to load clearance products"
          : "Failed to load clearance products";
        setProducts([]);
        setLoadError(message);
        toast.error(message);
      } finally {
        if (!ignore) {
          setLoading(false);
          setReloading(false);
        }
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, [filters, categoryId]);

  const retry = () => {
    setReloading(true);
    setFilters((prev) => ({ ...prev }));
  };

  const handleAddToCart = async (product: { id: number }) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success("Item added to cart!");
      return;
    }
    toast.error(result.error || "Failed to add item");
  };

  const title = categoryName ? `${categoryName} clearance` : "Clearance sale";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <FaTag className="text-2xl text-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
        </div>
        <p className="text-muted">
          {categoryName
            ? `Discounted ${categoryName.toLowerCase()} still in the sale.`
            : "Discounted stock from across the shop."}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Select
            label="Sort by"
            value={`${filters.sortBy}|${filters.sortOrder}`}
            options={[
              { value: "created_at|DESC", label: "Newest first" },
              { value: "created_at|ASC", label: "Oldest first" },
              { value: "price|ASC", label: "Price: low to high" },
              { value: "price|DESC", label: "Price: high to low" },
              { value: "name|ASC", label: "Name: A to Z" },
              { value: "name|DESC", label: "Name: Z to A" },
            ]}
            onChange={(event) => {
              const [sortBy, sortOrder] = event.target.value.split("|");
              setFilters({ sortBy: sortBy || "created_at", sortOrder: sortOrder || "DESC", page: 1 });
            }}
          />
        </div>
        <p className="text-sm text-muted">
          {loading
            ? "Loading clearance"
            : `${pagination.total} ${pagination.total === 1 ? "item" : "items"} on clearance`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
          <p className="sr-only">Loading clearance products</p>
        </div>
      ) : null}
      {!loading && loadError ? (
        <EmptyState
          title="Clearance could not be loaded"
          description={loadError}
          action={
            <Button type="button" loading={reloading} onClick={retry}>
              Try again
            </Button>
          }
        />
      ) : null}
      {!loading && !loadError && products.length === 0 ? (
        <EmptyState
          title="No clearance products"
          description={
            categoryName
              ? `Nothing in ${categoryName} is on clearance right now.`
              : "Nothing is on clearance right now."
          }
        />
      ) : null}
      {!loading && !loadError && products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            limit={pagination.limit || 15}
            total={pagination.total}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      ) : null}
    </div>
  );
}

export default Clearance;
