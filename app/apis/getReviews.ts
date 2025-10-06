import { apiService } from "./apiService";
import { GetReviewsResponse } from "../types/Review";

export const getReviews = async (productId: string): Promise<GetReviewsResponse> => {
  try {
    const response = await apiService<GetReviewsResponse>({
      endpoint: `api/reviews/get-all?productId=${productId}`,
      method: "GET",
    });

    if ('response' in response) {
      return response.response as GetReviewsResponse;
    } else {
      throw new Error("Failed to fetch reviews");
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
