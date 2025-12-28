/**
 * Like Button Component
 * Like/unlike button with like count display
 *
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Button from "./Button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

/**
 * LikeButton component
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID
 * @returns {JSX.Element} Like button component
 */
const LikeButton = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /**
   * Fetch like status and count
   */
  const fetchLikeStatus = async () => {
    try {
      // Fetch like count (public)
      const countResponse = await axios.get(`/api/products/${productId}/likes`);
      setLikeCount(countResponse.data.count);

      // Fetch user's like status (if authenticated)
      if (isAuthenticated) {
        const likedResponse = await axios.get(
          `/api/products/${productId}/liked`,
          {
            withCredentials: true,
          }
        );
        setLiked(likedResponse.data.liked);
      }
    } catch (error) {
      // Silent error handling for like status fetch
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchLikeStatus();
    }
  }, [productId, isAuthenticated]);

  /**
   * Handle like/unlike toggle
   */
  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like products");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `/api/products/${productId}/like`,
        {},
        {
          withCredentials: true,
        }
      );
      setLiked(response.data.liked);
      setLikeCount(response.data.count);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to toggle like";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center space-x-2">
        {/* Loading skeleton */}
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Like button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleLike}
        loading={loading}
        disabled={!isAuthenticated}
        icon={liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      >
        {liked ? "Liked" : "Like"}
      </Button>

      {/* Like count */}
      <span className="text-sm text-gray-600">
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>
    </div>
  );
};

export default LikeButton;
