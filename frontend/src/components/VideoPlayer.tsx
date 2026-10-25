import { useState } from "react";

export interface ProductVideoItem {
  id?: number;
  video_url?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  is_primary?: boolean | number | null;
}

interface VideoPlayerProps {
  videos?: ProductVideoItem[];
}

function VideoPlayer({ videos = [] }: VideoPlayerProps) {
  const playable = videos.filter((video) => video.video_url);
  const primaryIndex = Math.max(
    0,
    playable.findIndex((video) => video.is_primary),
  );
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex === -1 ? 0 : primaryIndex);

  if (playable.length === 0) {
    return null;
  }

  const current = playable[Math.min(selectedIndex, playable.length - 1)];
  if (!current?.video_url) {
    return null;
  }

  return (
    <section aria-labelledby="product-video-heading" className="mt-10">
      <h2 id="product-video-heading" className="mb-4 font-display text-3xl text-ink">
        Product video
      </h2>
      {playable.length > 1 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {playable.map((video, index) => (
            <button
              key={video.id ?? video.video_url}
              type="button"
              aria-pressed={index === selectedIndex}
              className={`rounded-ui border px-3 py-2 font-ui text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                index === selectedIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-line bg-surface text-ink hover:bg-surface-muted"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              {video.title || `Video ${index + 1}`}
            </button>
          ))}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui">
        <video
          key={current.video_url}
          controls
          className="w-full"
          poster={current.thumbnail_url || undefined}
        >
          <source src={current.video_url} type="video/mp4" />
          Your browser does not support this video.
        </video>
      </div>
      {current.title ? <p className="mt-2 text-ink">{current.title}</p> : null}
      {current.description ? <p className="mt-1 text-sm text-muted">{current.description}</p> : null}
    </section>
  );
}

export default VideoPlayer;
