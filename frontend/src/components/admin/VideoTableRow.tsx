import { Link } from "react-router-dom";
import { FaEdit, FaPlay, FaStar, FaTrash } from "react-icons/fa";
import BulkSelectCheckbox from "./BulkSelectCheckbox";
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
    <tr className="hover:bg-surface-muted">
      <td className="px-6 py-4"><BulkSelectCheckbox itemId={video.id} isSelected={isSelected} onToggle={onToggle} /></td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{video.id}</td>
      <td className="px-6 py-4">
        <div className="relative h-16 w-24 overflow-hidden rounded-ui-sm bg-surface-muted">
          {isPlaying ? (
            <video src={mediaUrl(video.video_url)} controls className="h-full w-full" onEnded={() => onPlay(null)} />
          ) : video.thumbnail_url ? (
            <img src={mediaUrl(video.thumbnail_url)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted"><FaPlay aria-hidden="true" /></div>
          )}
        </div>
      </td>
      <td className="max-w-xs truncate px-6 py-4 text-sm" title={title}>{title}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <Link to={`/admin/products/${video.product_id}/edit`} className={`text-primary hover:underline ${focusRing}`}>{name}</Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{durationLabel(video.duration)}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        {video.is_primary ? <Badge variant="warning">Primary</Badge> : (
          <button type="button" onClick={() => onSetPrimary(video.id)} className={`text-muted hover:text-ink ${focusRing}`} aria-label={`Set ${title} as primary`}>
            <FaStar aria-hidden="true" />
          </button>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">{formatDate(video.created_at || "")}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onPlay(isPlaying ? null : video.id)} className={`text-primary ${focusRing}`} aria-label={isPlaying ? `Stop ${title}` : `Play ${title}`}><FaPlay aria-hidden="true" /></button>
          <button type="button" onClick={() => onEdit(video)} className={`text-ink ${focusRing}`} aria-label={`Edit ${title}`}><FaEdit aria-hidden="true" /></button>
          <button type="button" onClick={() => onDelete(video.id)} className={`text-danger ${focusRing}`} aria-label={`Delete ${title}`}><FaTrash aria-hidden="true" /></button>
        </div>
      </td>
    </tr>
  );
}
