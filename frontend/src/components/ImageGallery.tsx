import { useEffect, useState, type KeyboardEvent } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import comingSoon from "../assets/images/image_comming_soon.png";

export interface GalleryImage {
  id?: number;
  image_url?: string | null;
  is_primary?: boolean | number | null;
}

interface ImageGalleryProps {
  images?: GalleryImage[];
  productName?: string;
}

const control =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-ui hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

function ImageGallery({ images = [], productName = "Product" }: ImageGalleryProps) {
  const usable = images.filter((image) => image.image_url);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failed, setFailed] = useState<number[]>([]);

  useEffect(() => {
    setSelectedIndex(0);
    setFailed([]);
  }, [images]);

  if (usable.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-ui border border-line bg-surface-muted">
        <img src={comingSoon} alt="" className="h-full w-full object-contain" />
        <span className="sr-only">No photo for {productName}</span>
      </div>
    );
  }

  const index = Math.min(selectedIndex, usable.length - 1);
  const current = usable[index];
  const failedCurrent = current?.id != null ? failed.includes(current.id) : failed.includes(index);
  const src = current?.image_url && !failedCurrent ? current.image_url : comingSoon;

  const show = (next: number) => {
    setSelectedIndex((next + usable.length) % usable.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    }
  };

  return (
    <div
      role="region"
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={`${productName} photos`}
      className="rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onKeyDown={onKeyDown}
    >
      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {usable.length}
      </p>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-ui border border-line bg-surface-muted">
        <img
          src={src}
          alt=""
          className="h-full w-full object-contain"
          decoding="async"
          fetchPriority="high"
          onError={() => {
            const key = current?.id ?? index;
            setFailed((ids) => (ids.includes(key) ? ids : [...ids, key]));
          }}
        />
        {usable.length > 1 ? (
          <>
            <button type="button" className={`${control} absolute left-3`} aria-label="Previous photo" onClick={() => show(index - 1)}>
              <FaChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className={`${control} absolute right-3`} aria-label="Next photo" onClick={() => show(index + 1)}>
              <FaChevronRight aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      {usable.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {usable.map((image, imageIndex) => {
            const key = image.id ?? imageIndex;
            const thumbFailed = failed.includes(key);
            const selected = imageIndex === index;
            return (
              <button
                key={key}
                type="button"
                aria-label={`Show photo ${imageIndex + 1}`}
                aria-pressed={selected}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-ui-sm border-2 bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selected ? "border-primary" : "border-line"
                }`}
                onClick={() => show(imageIndex)}
              >
                <img
                  src={image.image_url && !thumbFailed ? image.image_url : comingSoon}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailed((ids) => (ids.includes(key) ? ids : [...ids, key]))}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default ImageGallery;
