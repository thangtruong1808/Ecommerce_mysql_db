/**
 * Media Uploader Component
 * Drag & drop file upload with preview and validation
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useRef } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'

/**
 * MediaUploader component
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Upload callback (files)
 * @param {string} props.accept - Accepted file types (e.g., 'image/*', 'video/*')
 * @param {number} props.maxSize - Max file size in MB
 * @param {number} props.maxFiles - Maximum number of files
 * @param {boolean} props.multiple - Allow multiple files
 * @returns {JSX.Element} Media uploader component
 * @author Thang Truong
 * @date 2025-12-12
 */
const MediaUploader = ({ 
  onUpload, 
  accept = 'image/*', 
  maxSize = 5, 
  maxFiles = 10,
  multiple = true 
}) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  /**
   * Validate file
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   * @author Thang Truong
   * @date 2025-12-12
   */
  const validateFile = (file) => {
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size exceeds ${maxSize}MB` }
    }
    return { valid: true }
  }

  /**
   * Handle file selection
   * @param {FileList} selectedFiles - Selected files
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles)
    const validFiles = []
    
    fileArray.forEach(file => {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        alert(validation.error)
      }
    })
    
    if (validFiles.length > 0) {
      const newFiles = multiple 
        ? [...files, ...validFiles].slice(0, maxFiles)
        : validFiles.slice(0, 1)
      setFiles(newFiles)
    }
  }

  /**
   * Handle drag events
   * @param {DragEvent} e - Drag event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  /**
   * Handle drop
   * @param {DragEvent} e - Drop event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  /**
   * Handle file input change
   * @param {Event} e - Change event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  /**
   * Remove file
   * @param {number} index - File index
   * @author Thang Truong
   * @date 2025-12-12
   */
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  /**
   * Handle upload
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpload = () => {
    if (files.length > 0 && onUpload) {
      onUpload(files)
      setFiles([])
    }
  }

  /* Media uploader component */
  return (
    <div className="space-y-4">
      {/* Drag & drop area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag & drop files here, or click to select
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">
          Max {maxSize}MB per file, up to {maxFiles} files
        </p>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">
              Selected Files ({files.length})
            </h3>
            <button
              type="button"
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{file.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes className="text-xs" />
                </button>
                <p className="text-xs text-gray-600 p-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaUploader
