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
    return <p className="py-12 text-center text-muted">No videos available</p>;
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <article key={video.id} className="rounded-ui border border-line bg-surface p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-ui-sm bg-surface-muted sm:w-48">
              {playingId === video.id ? (
                <video src={mediaUrl(video.video_url)} controls className="h-full w-full" onEnded={() => setPlayingId(null)} />
              ) : video.thumbnail_url ? (
                <img src={mediaUrl(video.thumbnail_url)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted"><FaPlay className="text-3xl" aria-hidden="true" /></div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium text-ink">{video.title || "Untitled video"}</h3>
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
              {video.description ? <p className="mt-2 text-sm text-muted">{video.description}</p> : null}
              <p className="mt-2 text-xs text-muted">Duration: {durationLabel(video.duration)} · Created: {formatDate(video.created_at || "")}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
