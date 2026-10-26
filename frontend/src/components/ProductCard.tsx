import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import comingSoon from "../assets/images/image_comming_soon.png";
import { Badge, Button } from "./ui";
import StarRating from "./StarRating";

interface CardImage {
  image_url?: string | null;
  is_primary?: boolean | number | null;
}

interface CardProduct {
  id: number;
  name?: string;
  price?: number | string;
  stock?: number;
  rating?: number | string | null;
  num_reviews?: number;
  images?: CardImage[];
  has_discount?: boolean | number | null;
  discounted_price?: number | string | null;
  discount_type?: string | null;
  discount_value?: number | string | null;
  likes_count?: number;
  like_count?: number;
  total_likes?: number;
  num_likes?: number;
  comments_count?: number;
  comment_count?: number;
  total_comments?: number;
  num_comments?: number;
}

interface ProductCardProps {
  product: CardProduct;
  onAddToCart?: (product: CardProduct) => void | Promise<void>;
}

function money(value: number | string | null | undefined): string {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

function primaryImage(product: CardProduct): string {
  const images = product.images ?? [];
  const primary = images.find((image) => image.is_primary);
  return primary?.image_url || images[0]?.image_url || comingSoon;
}

function countOf(product: CardProduct, keys: (keyof CardProduct)[]): number {
  for (const key of keys) {
    const value = product[key];
    if (typeof value === "number") {
      return value;
    }
  }
  return 0;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => primaryImage(product));
  const onSale = Boolean(product.has_discount && product.discounted_price);
  const outOfStock = product.stock === 0;
  const likes = countOf(product, ["likes_count", "like_count", "total_likes", "num_likes"]);
  const comments = countOf(product, ["comments_count", "comment_count", "total_comments", "num_comments"]);
  const rating = Number.parseFloat(String(product.rating ?? "")) || 0;

  const addToCart = async () => {
    if (!onAddToCart || adding || outOfStock) {
      return;
    }
    setAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui">
      <div className="relative">
        {onSale ? (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="promo" className="gap-1 px-2 py-0.5">
              <FaTag aria-hidden="true" />
              {product.discount_type === "percentage"
                ? `${Math.round(Number.parseFloat(String(product.discount_value)))}% off`
                : `${money(product.discount_value)} off`}
            </Badge>
          </div>
        ) : null}
        <Link
          to={`/products/${product.id}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <span className="flex aspect-square items-center justify-center bg-surface-muted">
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => {
                if (imageSrc !== comingSoon) {
                  setImageSrc(comingSoon);
                }
              }}
            />
          </span>
          <span className="sr-only">{product.name || "Product"}</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          to={`/products/${product.id}`}
          className="rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h3 className="line-clamp-2 font-ui text-base font-semibold leading-6 text-ink">{product.name || "Product"}</h3>
        </Link>
        <div>
          {onSale ? (
            <>
              <p className="font-ui text-lg font-semibold text-secondary">{money(product.discounted_price)}</p>
              <p className="text-xs text-muted line-through">{money(product.price)}</p>
            </>
          ) : (
            <p className="font-ui text-lg font-semibold text-secondary">{money(product.price)}</p>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted">
          <StarRating rating={rating} readOnly size="sm" />
          {product.num_reviews ? <span className="sr-only">{product.num_reviews} reviews</span> : null}
          <span>
            {likes} likes · {comments} comments
          </span>
        </div>
        {onAddToCart ? (
          <Button
            type="button"
            className="mt-auto w-full"
            loading={adding}
            disabled={outOfStock}
            onClick={() => void addToCart()}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export default ProductCard;
