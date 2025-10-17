import { apiService } from "./apiService";

export interface CheckPurchaseResponse {
  success: boolean;
  data: {
    is_purchased: boolean;
    product_id: string;
  };
  message?: string;
  statusCode?: number;
}

export const checkUserPurchase = async (productId: string): Promise<CheckPurchaseResponse> => {
  try {
    const response = await apiService<CheckPurchaseResponse>({
      endpoint: `api/product/check-purchased?product_id=${productId}`,
      method: "GET",
    });

    if ('response' in response) {
      return response.response as CheckPurchaseResponse;
    } else {
      throw new Error("Failed to check purchase status");
    }
  } catch (error) {
    console.error("Error checking purchase status:", error);
    throw error;
  }
};
