export type Review = {
  _id: string;
  productId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  rating: number; // 1-5 stars
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  helpful?: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewResponse = {
  success: boolean;
  data: {
    reviews: Review[];
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      [key: number]: number; // rating: count
    };
  };
};

// Backend get-all response shape provided by API
export type GetReviewsResponse = {
  data: Review[];
  message: string;
  success: boolean;
  statusCode: number;
};

export type AddReviewRequest = {
  title: string;
  rating: number;
  description: string;
};

export type AddReviewResponse = {
  success: boolean;
  message?: string;
  data?: Review;
};
