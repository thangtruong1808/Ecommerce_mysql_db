export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

export interface ReviewEligibility {
  eligible?: boolean;
  reason?: string;
  message?: string;
}

export interface Comment {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  is_approved: boolean | 0 | 1;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
}

export interface CommentInput {
  comment: string;
}

export interface LikeState {
  liked: boolean;
  count?: number;
}

export interface ProductLikes {
  count: number;
  likes?: Array<{
    id: number;
    product_id: number;
    user_id: number;
    created_at?: string;
  }>;
}
