import { useCallback, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowRight,
  FaShieldAlt,
  FaShippingFast,
  FaTag,
  FaUndo,
} from "react-icons/fa";
import type { Voucher } from "@shared/commerce";
import { CategoryCarousel, type HomeCategory } from "../components/CategoryCarousel";
import ProductCard from "../components/ProductCard";
import RecentlyViewed from "../components/RecentlyViewed";
import Recommendations from "../components/Recommendations";
import VoucherCodeItem from "../components/VoucherCodeItem";
import { Button, EmptyState, Skeleton } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import usePageTitle from "../hooks/usePageTitle";

interface HomeProduct {
  id: number;
  name?: string;
}

type LoadStatus = "loading" | "ready" | "error";

const viewAll =
  "inline-flex items-center gap-2 rounded-ui-sm text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

function asCategories(data: unknown): HomeCategory[] | null {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.filter((item): item is HomeCategory => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const category = item as Partial<HomeCategory>;
    return typeof category.id === "number" && typeof category.name === "string";
  });
}

function asProducts(data: unknown): HomeProduct[] | null {
  if (!data || typeof data !== "object" || !("products" in data)) {
    return null;
  }
  const products = (data as { products?: unknown }).products;
  if (!Array.isArray(products)) {
    return null;
  }
  return products.filter((item): item is HomeProduct => {
    return Boolean(item) && typeof item === "object" && typeof (item as HomeProduct).id === "number";
  });
}

function asVouchers(data: unknown): Voucher[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item): item is Voucher => {
    return Boolean(item) && typeof item === "object" && typeof (item as Voucher).code === "string";
  });
}

function ProductSkeletons({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-64" />
      ))}
      <p className="sr-only">Loading products</p>
    </div>
  );
}

function SectionHeading({
  id,
  title,
  to,
  action,
}: {
  id: string;
  title: string;
  to: string;
  action: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3">
      <h2 id={id} className="text-2xl font-bold text-ink sm:text-3xl">
        {title}
      </h2>
      <Link to={to} className={viewAll}>
        {action} <FaArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}

function Home() {
  usePageTitle("Home");
  const navigate = useNavigate();
  const { addToCart } = useCart() as {
    addToCart: (productId: number, quantity?: number) => Promise<{ success?: boolean; error?: string }>;
  };
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [featured, setFeatured] = useState<HomeProduct[]>([]);
  const [clearance, setClearance] = useState<HomeProduct[]>([]);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [featuredStatus, setFeaturedStatus] = useState<LoadStatus>("loading");
  const [clearanceStatus, setClearanceStatus] = useState<LoadStatus>("loading");
  const [categoryStatus, setCategoryStatus] = useState<LoadStatus>("loading");
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set());
  const [retrying, setRetrying] = useState(false);

  const loadHome = useCallback(async () => {
    setFeaturedStatus("loading");
    setClearanceStatus("loading");
    setCategoryStatus("loading");
    const [productsResult, clearanceResult, categoriesResult, vouchersResult] =
      await Promise.allSettled([
        axios.get("/api/products?limit=10&sortBy=created_at&sortOrder=DESC"),
        axios.get("/api/products/clearance?limit=4"),
        axios.get("/api/products/categories"),
        axios.get("/api/vouchers"),
      ]);

    if (productsResult.status === "fulfilled") {
      const products = asProducts(productsResult.value.data);
      setFeatured(products ?? []);
      setFeaturedStatus(products ? "ready" : "error");
    } else {
      setFeatured([]);
      setFeaturedStatus("error");
    }

    if (clearanceResult.status === "fulfilled") {
      const products = asProducts(clearanceResult.value.data);
      setClearance(products ?? []);
      setClearanceStatus(products ? "ready" : "error");
    } else {
      setClearance([]);
      setClearanceStatus("error");
    }

    if (categoriesResult.status === "fulfilled") {
      const list = asCategories(categoriesResult.value.data);
      setCategories(list ?? []);
      setCategoryStatus(list ? "ready" : "error");
    } else {
      setCategories([]);
      setCategoryStatus("error");
    }

    if (vouchersResult.status === "fulfilled") {
      setVouchers(asVouchers(vouchersResult.value.data));
    } else {
      setVouchers([]);
    }
  }, []);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  const retry = async () => {
    setRetrying(true);
    try {
      await loadHome();
    } finally {
      setRetrying(false);
    }
  };

  const handleAddToCart = async (product: HomeProduct) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const result = await addToCart(product.id, 1);
    if (result?.success) {
      toast.success("Added to cart");
      return;
    }
    toast.error(result?.error || "Failed to add item to cart");
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes((previous) => new Set(previous).add(code));
      toast.success(`Voucher code ${code} copied`);
      window.setTimeout(() => {
        setCopiedCodes((previous) => {
          const next = new Set(previous);
          next.delete(code);
          return next;
        });
      }, 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const features: { icon: ReactNode; label: string }[] = [
    { icon: <FaShippingFast aria-hidden="true" />, label: "Free shipping over $100" },
    { icon: <FaShieldAlt aria-hidden="true" />, label: "Secure payment" },
    { icon: <FaUndo aria-hidden="true" />, label: "Easy returns" },
    { icon: <FaTag aria-hidden="true" />, label: "Vouchers and discounts" },
  ];

  return (
    <div>
      <section className="bg-primary text-on-primary">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl font-bold sm:text-4xl">
            Welcome to Badminton Stores
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-on-primary/90">
            Rackets, shoes, and court gear, with voucher codes on selected stock.
          </p>
          {vouchers.length > 0 ? (
            <div className="mt-6">
              <ul className="flex flex-wrap items-center justify-center gap-3">
                {vouchers.slice(0, 4).map((voucher, index) => (
                  <li key={voucher.id}>
                    <VoucherCodeItem
                      voucher={voucher}
                      isCopied={copiedCodes.has(voucher.code)}
                      onCopy={handleCopyCode}
                      showHeader={index === 0}
                    />
                  </li>
                ))}
              </ul>
              {vouchers.length > 4 ? (
                <p className="mt-2 text-center text-sm text-on-primary/80">
                  +{vouchers.length - 4} more voucher{vouchers.length - 4 === 1 ? "" : "s"} available
                </p>
              ) : null}
            </div>
          ) : null}
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/20 pt-4 text-sm text-on-primary/90">
            {features.map((feature) => (
              <li key={feature.label} className="inline-flex items-center gap-2">
                {feature.icon}
                {feature.label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/products" className="inline-flex h-10 items-center rounded-ui-sm bg-secondary px-4 text-sm font-semibold text-on-secondary hover:bg-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
              Shop products
            </Link>
            <Link to="/clearance" className="inline-flex h-10 items-center rounded-ui-sm border border-white/40 px-4 text-sm font-semibold text-on-primary hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
              View clearance
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        <section aria-labelledby="home-categories">
          <SectionHeading id="home-categories" title="Shop by category" to="/products" action="View all" />
          {categoryStatus === "loading" ? <Skeleton className="h-80" /> : null}
          {categoryStatus === "error" ? (
            <EmptyState
              title="Categories could not be loaded"
              description="The shop categories did not come back. Try again."
              action={<Button type="button" loading={retrying} onClick={() => void retry()}>Try again</Button>}
            />
          ) : null}
          {categoryStatus === "ready" && categories.length === 0 ? (
            <EmptyState title="No categories yet" description="Categories will appear here when they are added." />
          ) : null}
          {categoryStatus === "ready" && categories.length > 0 ? (
            <CategoryCarousel categories={categories} />
          ) : null}
        </section>

        {clearanceStatus !== "ready" || clearance.length > 0 ? (
          <section aria-labelledby="home-clearance">
            <SectionHeading id="home-clearance" title="Clearance deals" to="/clearance" action="View all" />
            {clearanceStatus === "loading" ? <ProductSkeletons count={4} /> : null}
            {clearanceStatus === "error" ? (
              <EmptyState
                title="Clearance could not be loaded"
                description="The clearance list did not come back. Try again."
                action={<Button type="button" loading={retrying} onClick={() => void retry()}>Try again</Button>}
              />
            ) : null}
            {clearanceStatus === "ready" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {clearance.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <section aria-labelledby="home-featured">
          <SectionHeading id="home-featured" title="Featured products" to="/products" action="View all" />
          {featuredStatus === "loading" ? <ProductSkeletons count={8} /> : null}
          {featuredStatus === "error" ? (
            <EmptyState
              title="Featured products could not be loaded"
              description="The latest products did not come back. Try again."
              action={<Button type="button" loading={retrying} onClick={() => void retry()}>Try again</Button>}
            />
          ) : null}
          {featuredStatus === "ready" && featured.length === 0 ? (
            <EmptyState
              title="No products yet"
              description="New stock will show up in this list."
              action={<Link to="/products" className={viewAll}>Browse the shop</Link>}
            />
          ) : null}
          {featuredStatus === "ready" && featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : null}
        </section>

        <RecentlyViewed limit={15} showTitle onAddToCart={handleAddToCart} />
        <Recommendations productId={null} limit={15} showTitle onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
}

export default Home;
