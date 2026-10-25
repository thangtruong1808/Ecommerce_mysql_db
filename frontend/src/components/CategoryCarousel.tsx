import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface HomeCategory {
  id: number;
  name: string;
  description?: string | null;
  photo_url?: string | null;
}

interface CategoryCarouselProps {
  categories: HomeCategory[];
}

function photoUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  if (value.startsWith("http")) {
    return value;
  }
  return `${window.location.origin}${value}`;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

const control =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-ui hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedIds, setFailedIds] = useState<number[]>([]);
  const reducedMotion = useReducedMotion();
  const resumeTimer = useRef<number | null>(null);

  const count = categories.length;
  const current = categories[currentIndex];

  useEffect(() => {
    if (reducedMotion || paused || count < 2) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) {
        window.clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  if (!current) {
    return null;
  }

  const showSlide = (index: number) => {
    setCurrentIndex((index + count) % count);
    setPaused(true);
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
    }
    if (!reducedMotion) {
      resumeTimer.current = window.setTimeout(() => setPaused(false), 8000);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentIndex + 1);
    }
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setPaused(false);
    }
  };

  const image = photoUrl(current.photo_url);
  const showImage = Boolean(image) && !failedIds.includes(current.id);

  return (
    <div
      className="flex flex-col gap-4"
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop by category"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
    >
      <p className="sr-only" aria-live="polite">
        {current.name}, {currentIndex + 1} of {count}
      </p>
      <div className="overflow-hidden rounded-ui border border-line bg-surface shadow-ui">
        <Link
          to={`/products?category=${current.id}`}
          className="grid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary lg:grid-cols-5"
        >
          <div className="flex min-h-56 items-center justify-center bg-surface-muted lg:col-span-3 lg:min-h-80">
            {showImage ? (
              <img
                src={image ?? undefined}
                alt=""
                className="h-full max-h-80 w-full object-cover"
                decoding="async"
                fetchPriority="high"
                onError={() =>
                  setFailedIds((ids) => (ids.includes(current.id) ? ids : [...ids, current.id]))
                }
              />
            ) : (
              <span className="text-4xl font-semibold text-muted" aria-hidden="true">
                {current.name.slice(0, 1)}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 text-left lg:col-span-2 lg:p-8">
            <h3 className="text-2xl font-bold text-ink sm:text-3xl">{current.name}</h3>
            {current.description ? (
              <p className="mt-3 text-sm text-muted">{current.description}</p>
            ) : (
              <p className="mt-3 text-sm text-muted">
                Browse {current.name.toLowerCase()} in the shop.
              </p>
            )}
            <span className="mt-4 text-sm font-semibold text-primary">
              Shop {current.name}
            </span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={control} aria-label="Previous category" onClick={() => showSlide(currentIndex - 1)}>
          <FaChevronLeft aria-hidden="true" />
        </button>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {categories.map((category, index) => {
            const thumb = photoUrl(category.photo_url);
            const showThumb = Boolean(thumb) && !failedIds.includes(category.id);
            const selected = index === currentIndex;
            return (
              <button
                key={category.id}
                type="button"
                aria-label={`Show ${category.name}`}
                aria-pressed={selected}
                className={`w-28 shrink-0 rounded-ui border p-2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line bg-surface text-ink hover:bg-surface-muted"
                }`}
                onClick={() => showSlide(index)}
              >
                <span className="flex h-14 items-center justify-center overflow-hidden rounded-ui-sm bg-surface-muted">
                  {showThumb ? (
                    <img
                      src={thumb ?? undefined}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setFailedIds((ids) =>
                          ids.includes(category.id) ? ids : [...ids, category.id],
                        )
                      }
                    />
                  ) : (
                    <span className="text-lg font-semibold text-muted">{category.name.slice(0, 1)}</span>
                  )}
                </span>
                <span className="mt-1 block truncate text-xs font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className={control} aria-label="Next category" onClick={() => showSlide(currentIndex + 1)}>
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
