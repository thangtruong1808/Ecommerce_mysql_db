import { useState } from "react";
import { FaEdit, FaPlay, FaStar, FaTrash } from "react-icons/fa";
import { Badge } from "../ui";
import { focusRing } from "../ui/styles";
import { formatDate } from "../../utils/dateUtils";
import { durationLabel, mediaUrl } from "../../pages/admin/mediaFormat";
import type { ProductVideo } from "@shared/catalog";

interface VideoListProps {
  videos: ProductVideo[];
  busy?: boolean;
  onSetPrimary: (videoId: number) => void;
  onDelete: (videoId: number) => void;
  onEdit: (video: ProductVideo) => void;
}

export default function VideoList({ videos, busy = false, onSetPrimary, onDelete, onEdit }: VideoListProps) {
  const [playingId, setPlayingId] = useState<number | null>(null);

  if (videos.length === 0) {
    return <p className="py-12 text-center font-ui text-sm text-muted">No videos available</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {videos.map((video) => (
        <article key={video.id} className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui">
          <div className="relative aspect-video overflow-hidden bg-surface-muted">
            {playingId === video.id ? (
              <video src={mediaUrl(video.video_url)} controls className="h-full w-full" onEnded={() => setPlayingId(null)} />
            ) : video.thumbnail_url ? (
              <img src={mediaUrl(video.thumbnail_url)} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted"><FaPlay className="text-3xl" aria-hidden="true" /></div>
            )}
          </div>
          <div className="min-w-0 p-3">
            <div className="flex flex-col gap-2">
              <div className="min-w-0">
                <h3 className="break-words font-ui text-sm font-semibold text-ink">{video.title || "Untitled video"}</h3>
                {video.is_primary ? <Badge variant="warning" className="mt-1">Primary</Badge> : null}
              </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setPlayingId(playingId === video.id ? null : video.id)} className={`rounded-ui-sm p-2 text-primary hover:bg-surface-muted ${focusRing}`} aria-label={playingId === video.id ? `Stop ${video.title || "video"}` : `Play ${video.title || "video"}`}>
                    <FaPlay aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => onEdit(video)} className={`rounded-ui-sm p-2 text-ink hover:bg-surface-muted ${focusRing}`} aria-label={`Edit ${video.title || "video"}`}>
                    <FaEdit aria-hidden="true" />
                  </button>
                  {!video.is_primary ? (
                    <button type="button" disabled={busy} onClick={() => onSetPrimary(video.id)} className={`rounded-ui-sm p-2 text-ink hover:bg-surface-muted disabled:opacity-60 ${focusRing}`} aria-label={`Set ${video.title || "video"} as primary`}>
                      <FaStar aria-hidden="true" />
                    </button>
                  ) : null}
                  <button type="button" disabled={busy} onClick={() => onDelete(video.id)} className={`rounded-ui-sm p-2 text-danger hover:bg-surface-muted disabled:opacity-60 ${focusRing}`} aria-label={`Delete ${video.title || "video"}`}>
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              </div>
              {video.description ? <p className="mt-2 break-words font-ui text-sm text-muted">{video.description}</p> : null}
              <p className="mt-2 font-ui text-xs text-muted">Duration: {durationLabel(video.duration)} · Created: {formatDate(video.created_at || "")}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
