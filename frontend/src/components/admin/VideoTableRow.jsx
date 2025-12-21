/**
 * Video Table Row Component
 * Table row for video management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import { FaTrash, FaStar, FaEdit, FaPlay } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'

/**
 * VideoTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.video - Video object
 * @param {boolean} props.isSelected - Whether video is selected
 * @param {boolean} props.isPlaying - Whether video is playing
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onPlay - Play callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onSetPrimary - Set primary callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Video table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const VideoTableRow = ({ video, isSelected, isPlaying, onToggle, onPlay, onEdit, onSetPrimary, onDelete }) => {
  /**
   * Get video URL
   * @param {string} url - Video URL
   * @returns {string} Full video URL
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getVideoUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `${window.location.origin}${url}`
  }

  /**
   * Format duration
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /* Video table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={video.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.id}</td>
      <td className="px-6 py-4">
        <div className="relative w-24 h-16 bg-gray-200 rounded flex-shrink-0">
          {video.thumbnail_url ? (
            <img
              src={getVideoUrl(video.thumbnail_url)}
              alt={video.title || 'Video thumbnail'}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaPlay className="text-xl" />
            </div>
          )}
          {isPlaying && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
              <video
                src={getVideoUrl(video.video_url)}
                controls
                className="max-w-full max-h-full"
                onEnded={() => onPlay(null)}
              />
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="max-w-xs truncate" title={video.title || 'Untitled'}>
          {video.title || 'Untitled Video'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          to={`/admin/products/${video.product_id}/edit`}
          className="text-blue-600 hover:text-blue-800"
        >
          {video.product_name || `Product #${video.product_id}`}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDuration(video.duration)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {video.is_primary ? (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-600 text-white px-2 py-1 rounded">
            <FaStar className="text-xs" />
            Primary
          </span>
        ) : (
          <button
            onClick={() => onSetPrimary(video.id)}
            className="text-gray-400 hover:text-yellow-700"
            aria-label="Set as primary"
          >
            <FaStar />
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(video.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlay(isPlaying ? null : video.id)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Play video"
          >
            <FaPlay />
          </button>
          <button
            onClick={() => onEdit(video)}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Edit video"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete video"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default VideoTableRow
