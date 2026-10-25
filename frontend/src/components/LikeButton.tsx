import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Button, Skeleton } from "./ui";
import { useAuth } from "../context/AuthContext";

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }
  return fallback;
}

function LikeButton({ productId }: { productId: number }) {
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setInitialLoading(true);
    setLoadError(null);
    try {
      const countResponse = await axios.get(`/api/products/${productId}/likes`);
      setLikeCount(Number(countResponse.data?.count) || 0);
      if (isAuthenticated) {
        const likedResponse = await axios.get(`/api/products/${productId}/liked`);
        setLiked(Boolean(likedResponse.data?.liked));
      } else {
        setLiked(false);
      }
    } catch (error) {
      setLoadError(messageFrom(error, "Likes could not be loaded."));
    } finally {
      setInitialLoading(false);
    }
  }, [isAuthenticated, productId]);

  useEffect(() => {
    if (productId) {
      void load();
    }
  }, [load, productId]);

  const toggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like products");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`/api/products/${productId}/like`, {});
      setLiked(Boolean(response.data?.liked));
      setLikeCount(Number(response.data?.count) || 0);
    } catch (error) {
      toast.error(messageFrom(error, "Failed to toggle like"));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <span className="sr-only">Loading likes</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={() => void load()}>
        Retry likes
      </Button>
    );
  }

  const countLabel = `${likeCount} ${likeCount === 1 ? "like" : "likes"}`;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        loading={loading}
        aria-pressed={liked}
        onClick={() => void toggleLike()}
      >
        {liked ? <FaHeart className="text-danger" aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
        {liked ? "Liked" : "Like"}
      </Button>
      <span className="text-sm text-muted">{countLabel}</span>
    </div>
  );
}

export default LikeButton;
