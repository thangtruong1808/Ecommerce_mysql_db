/**
 * Video Player Component
 * Displays product videos (optional feature)
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * VideoPlayer component
 * @param {Object} props - Component props
 * @param {Array} props.videos - Array of video objects
 * @returns {JSX.Element} Video player component
 */
const VideoPlayer = ({ videos = [] }) => {
  /**
   * Get primary video or first video
   * @returns {Object|null} Primary video or null
   */
  const getPrimaryVideo = () => {
    if (!videos || videos.length === 0) return null
    return videos.find(v => v.is_primary) || videos[0]
  }

  const primaryVideo = getPrimaryVideo()

  if (!primaryVideo || !primaryVideo.video_url) {
    return null // Don't render if no videos
  }

  return (
    <div className="mt-8">
      {/* Video section container */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Video</h3>
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        {/* Video player */}
        <video
          controls
          className="w-full"
          poster={primaryVideo.thumbnail_url || ''}
        >
          <source src={primaryVideo.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {primaryVideo.title && (
        <p className="mt-2 text-gray-600">{primaryVideo.title}</p>
      )}
      {primaryVideo.description && (
        <p className="mt-1 text-sm text-gray-500">{primaryVideo.description}</p>
      )}
    </div>
  )
}

export default VideoPlayer

