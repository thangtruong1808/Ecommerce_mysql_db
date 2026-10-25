import { Link } from "react-router-dom";
import { FaEdit, FaPlay, FaStar, FaTrash } from "react-icons/fa";
import { CategorySelectBox } from "./categoryListChrome";
import { Badge } from "../ui";
import { focusRing } from "../ui/styles";
import { formatDate } from "../../utils/dateUtils";
import { durationLabel, mediaUrl } from "../../pages/admin/mediaFormat";
import type { ProductVideo } from "@shared/catalog";

export interface AdminVideo extends ProductVideo {
  product_name?: string | null;
}

interface VideoTableRowProps {
  video: AdminVideo;
  isSelected: boolean;
  isPlaying: boolean;
  onToggle: (id: number | string) => void;
  onPlay: (id: number | null) => void;
  onEdit: (video: AdminVideo) => void;
  onSetPrimary: (videoId: number) => void;
  onDelete: (videoId: number) => void;
}

export default function VideoTableRow({
  video,
  isSelected,
  isPlaying,
  onToggle,
  onPlay,
  onEdit,
  onSetPrimary,
  onDelete,
}: VideoTableRowProps) {
  const name = video.product_name || `Product #${video.product_id}`;
  const title = video.title || "Untitled video";
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui">
      <div className="relative aspect-video overflow-hidden bg-surface-muted">
        {isPlaying ? (
          <video src={mediaUrl(video.video_url)} controls className="h-full w-full" onEnded={() => onPlay(null)} />
        ) : video.thumbnail_url ? (
          <img src={mediaUrl(video.thumbnail_url)} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <FaPlay className="text-3xl" aria-hidden="true" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <CategorySelectBox pressed={isSelected} label={`Select ${title}`} onClick={() => onToggle(video.id)} />
        </div>
        {video.is_primary ? (
          <div className="absolute right-2 top-2">
            <Badge variant="warning">Primary</Badge>
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <h2 className="break-words font-ui text-sm font-semibold text-ink">{title}</h2>
        <Link to={`/admin/products/${video.product_id}/edit`} className={`truncate font-ui text-sm text-ink hover:text-primary ${focusRing}`} title={name}>
          {name}
        </Link>
        <p className="font-ui text-xs text-muted">
          {durationLabel(video.duration)} · {formatDate(video.created_at || "")}
        </p>
        <div className="mt-auto flex items-center gap-1">
          <button type="button" onClick={() => onPlay(isPlaying ? null : video.id)} className={`rounded-ui-sm p-2 text-primary hover:bg-surface-muted ${focusRing}`} aria-label={isPlaying ? `Stop ${title}` : `Play ${title}`}>
            <FaPlay aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onEdit(video)} className={`rounded-ui-sm p-2 text-ink hover:bg-surface-muted ${focusRing}`} aria-label={`Edit ${title}`}>
            <FaEdit aria-hidden="true" />
          </button>
          {!video.is_primary ? (
            <button type="button" onClick={() => onSetPrimary(video.id)} className={`rounded-ui-sm p-2 text-ink hover:bg-surface-muted ${focusRing}`} aria-label={`Set ${title} as primary`}>
              <FaStar aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" onClick={() => onDelete(video.id)} className={`rounded-ui-sm p-2 text-danger hover:bg-surface-muted ${focusRing}`} aria-label={`Delete ${title}`}>
            <FaTrash aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
