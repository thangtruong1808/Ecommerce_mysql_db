import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft, FaShoppingCart, FaTag } from "react-icons/fa";
import type { GalleryImage } from "../components/ImageGallery";
import ImageGallery from "../components/ImageGallery";
import type { ProductVideoItem } from "../components/VideoPlayer";
import VideoPlayer from "../components/VideoPlayer";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import LikeButton from "../components/LikeButton";
import StarRating from "../components/StarRating";
import RecentlyViewed from "../components/RecentlyViewed";
import Recommendations from "../components/Recommendations";
import Breadcrumb from "../components/Breadcrumb";
import { Badge, Button, EmptyState, Skeleton } from "../components/ui";
import { useCart } from "../context/CartContext";
import usePageTitle from "../hooks/usePageTitle";

interface DetailProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  rating?: number | string | null;
  num_reviews?: number;
  has_discount?: boolean | number | null;
  discounted_price?: number | string | null;
  discount_type?: string | null;
  discount_value?: number | string | null;
  images?: GalleryImage[];
  videos?: ProductVideoItem[];
  category_name?: string | null;
  subcategory_name?: string | null;
  child_category_name?: string | null;
  category_id?: number | null;
  subcategory_id?: number | null;
  child_category_id?: number | null;
}

function asProduct(data: unknown): DetailProduct | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  const product = data as Partial<DetailProduct>;
  if (typeof product.id !== "number" || typeof product.name !== "string") {
    return null;
  }
  return {
    ...product,
    id: product.id,
    name: product.name,
    price: product.price ?? 0,
    stock: Number(product.stock) || 0,
  };
}

function money(value: number | string | null | undefined): string {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart() as {
    addToCart: (productId: number, quantity?: number) => Promise<{ success?: boolean; error?: string }>;
  };
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const reviewListRef = useRef<(() => void) | null>(null);
  const commentListRef = useRef<(() => void) | null>(null);

  usePageTitle(loading ? "Loading..." : product?.name || "Product");

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoadError("Product not found");
      setLoading(false);
      return undefined;
    }
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get(`/api/products/${id}`);
        if (ignore) {
          return;
        }
        const next = asProduct(response.data);
        if (!next) {
          setProduct(null);
          setLoadError("Product could not be loaded.");
          return;
        }
        setProduct(next);
        setQuantity(1);
      } catch (error) {
        if (ignore) {
          return;
        }
        setProduct(null);
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message || "Product not found"
          : "Product not found";
        setLoadError(message);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const handleProductCardAddToCart = async (item: { id: number }) => {
    const result = await addToCart(item.id, 1);
    if (result?.success) {
      toast.success("Item added to cart!");
      return;
    }
    toast.error(result?.error || "Failed to add item to cart");
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    if (quantity < 1 || quantity > product.stock) {
      toast.error("Choose a quantity that is in stock");
      return;
    }
    setAddingToCart(true);
    try {
      const result = await addToCart(product.id, quantity);
      if (result?.success) {
        toast.success("Item added to cart!");
        return;
      }
      toast.error(result?.error || "Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const setClampedQuantity = (next: number) => {
    if (!product) {
      return;
    }
    if (Number.isNaN(next)) {
      return;
    }
    setQuantity(Math.min(product.stock, Math.max(1, next)));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <p className="sr-only">Loading product</p>
      </div>
    );
  }

  if (!product || loadError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Product not found"
          description={loadError || "This product is not available."}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                Try again
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/products")}>
                Back to products
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const onSale = Boolean(product.has_discount && product.discounted_price);
  const rating = Number.parseFloat(String(product.rating ?? "")) || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb
        categoryName={product.category_name}
        subcategoryName={product.subcategory_name}
        childCategoryName={product.child_category_name}
        categoryId={product.category_id}
        subcategoryId={product.subcategory_id}
        childCategoryId={product.child_category_id}
        productName={product.name}
      />
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-ui font-ui text-sm font-semibold text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <FaArrowLeft aria-hidden="true" />
        Back
      </button>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <ImageGallery images={product.images} productName={product.name} />
        </div>
        <div className="min-w-0 rounded-ui-lg border border-line bg-surface p-5 shadow-ui sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h1 className="min-w-0 flex-1 font-display text-4xl text-ink sm:text-5xl">{product.name}</h1>
            <LikeButton productId={product.id} />
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span aria-hidden="true">
              <StarRating rating={rating} readOnly size="sm" />
            </span>
            <span>
              {rating > 0
                ? `${rating.toFixed(1)} from ${product.num_reviews || 0} reviews`
                : "No reviews yet"}
            </span>
          </div>
          <div className="mb-4">
            {onSale ? (
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-ui text-4xl font-semibold text-secondary">{money(product.discounted_price)}</p>
                <p className="text-lg text-muted line-through">{money(product.price)}</p>
                <Badge variant="danger" className="gap-1 px-2 py-0.5">
                  <FaTag aria-hidden="true" />
                  {product.discount_type === "percentage"
                    ? `${Math.round(Number.parseFloat(String(product.discount_value)))}% off`
                    : `${money(product.discount_value)} off`}
                </Badge>
              </div>
            ) : (
              <p className="font-ui text-4xl font-semibold text-secondary">{money(product.price)}</p>
            )}
          </div>
          {product.description ? <p className="mb-6 text-muted">{product.description}</p> : null}
          <p className={`mb-6 font-ui text-sm font-semibold ${product.stock > 0 ? "text-success" : "text-danger"}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>
          {product.stock > 0 ? (
            <div>
              <label htmlFor="product-quantity" className="mb-2 block font-ui text-sm font-semibold text-ink">
                Quantity
              </label>
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-ui border border-line bg-canvas font-ui text-lg text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setClampedQuantity(quantity - 1)}
                >
                  −
                </button>
                <input
                  id="product-quantity"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  inputMode="numeric"
                  className="h-12 w-20 rounded-ui border border-line bg-canvas text-center font-ui text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onChange={(event) => setClampedQuantity(Number.parseInt(event.target.value, 10))}
                />
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-ui border border-line bg-canvas font-ui text-lg text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock}
                  onClick={() => setClampedQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <Button type="button" className="w-full" loading={addingToCart} onClick={() => void handleAddToCart()}>
                <FaShoppingCart aria-hidden="true" />
                Add to cart
              </Button>
            </div>
          ) : (
            <Button type="button" className="w-full" disabled>
              Out of stock
            </Button>
          )}
        </div>
      </div>

      <VideoPlayer videos={product.videos} />

      <section className="mt-12" aria-labelledby="product-reviews-heading">
        <h2 id="product-reviews-heading" className="mb-6 font-display text-3xl text-ink sm:text-4xl">
          Reviews
        </h2>
        <div className="mb-8">
          <ReviewForm
            productId={product.id}
            onReviewSubmitted={() => {
              reviewListRef.current?.();
            }}
          />
        </div>
        <div className="rounded-ui-lg border border-line bg-surface p-5 shadow-ui sm:p-6">
          <ReviewList productId={product.id} onRefetch={reviewListRef} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="product-comments-heading">
        <h2 id="product-comments-heading" className="mb-6 font-display text-3xl text-ink sm:text-4xl">
          Comments
        </h2>
        <div className="mb-8">
          <CommentForm
            productId={product.id}
            onCommentSubmitted={() => {
              commentListRef.current?.();
            }}
          />
        </div>
        <div className="rounded-ui-lg border border-line bg-surface p-5 shadow-ui sm:p-6">
          <CommentList productId={product.id} onRefetch={commentListRef} />
        </div>
      </section>

      <div className="mt-12">
        <Recommendations productId={product.id} limit={5} showTitle onAddToCart={handleProductCardAddToCart} />
      </div>
      <div className="mt-12">
        <RecentlyViewed
          limit={5}
          showTitle
          refreshKey={product.id}
          onAddToCart={handleProductCardAddToCart}
        />
      </div>
    </div>
  );
}

export default ProductDetail;
