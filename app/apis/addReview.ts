import { apiService } from "./apiService";
import { AddReviewRequest, AddReviewResponse } from "../types/Review";

export const addReview = async (productId: string, reviewData: AddReviewRequest): Promise<AddReviewResponse> => {
  try {
    const response = await apiService<AddReviewResponse>({
      endpoint: `api/reviews/add?productId=${productId}`,
      method: "POST",
      data: reviewData,
    });

    if ('response' in response) {
      return response.response;
    } else {
      throw new Error("Failed to add review");
    }
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
