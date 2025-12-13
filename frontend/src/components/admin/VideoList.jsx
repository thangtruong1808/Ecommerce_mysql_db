/**
 * Video List Component
 * List of videos with metadata display and actions
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'
import { FaStar, FaTrash, FaEdit, FaPlay } from 'react-icons/fa'

/**
 * VideoList component
 * @param {Object} props - Component props
 * @param {Array} props.videos - Array of video objects
 * @param {Function} props.onSetPrimary - Set primary callback (videoId)
 * @param {Function} props.onDelete - Delete callback (videoId)
 * @param {Function} props.onEdit - Edit callback (video)
 * @returns {JSX.Element} Video list component
 * @author Thang Truong
 * @date 2025-12-12
 */
const VideoList = ({ videos = [], onSetPrimary, onDelete, onEdit }) => {
  const [playingVideo, setPlayingVideo] = useState(null)

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

  /* Video list component */
  return (
    <div className="space-y-4">
      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No videos available
        </div>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Video thumbnail/preview */}
              <div className="relative w-48 h-32 bg-gray-200 rounded flex-shrink-0">
                {video.thumbnail_url ? (
                  <img
                    src={getVideoUrl(video.thumbnail_url)}
                    alt={video.title || 'Video thumbnail'}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaPlay className="text-3xl" />
                  </div>
                )}
                {playingVideo === video.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <video
                      src={getVideoUrl(video.video_url)}
                      controls
                      className="max-w-full max-h-full"
                      onEnded={() => setPlayingVideo(null)}
                    />
                  </div>
                )}
              </div>
              
              {/* Video info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {video.title || 'Untitled Video'}
                    </h3>
                    {video.is_primary && (
                      <span className="inline-flex items-center gap-1 text-xs bg-yellow-500 text-white px-2 py-1 rounded mt-1">
                        <FaStar className="text-xs" />
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      aria-label="Play video"
                    >
                      <FaPlay />
                    </button>
                    <button
                      onClick={() => onEdit?.(video)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                      aria-label="Edit video"
                    >
                      <FaEdit />
                    </button>
                    {!video.is_primary && (
                      <button
                        onClick={() => onSetPrimary?.(video.id)}
                        className="text-yellow-600 hover:text-yellow-800 p-2"
                        aria-label="Set as primary"
                      >
                        <FaStar />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete?.(video.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      aria-label="Delete video"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {video.description && (
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Duration: {formatDuration(video.duration)}</span>
                  <span>
                    Created: {new Date(video.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default VideoList
