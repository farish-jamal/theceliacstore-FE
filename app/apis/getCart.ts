import { apiService } from "./apiService";
import { endpoints } from "./endpoints";
import { CartApiResponse } from "@/app/types/Cart";

export const getCart = async (): Promise<CartApiResponse> => {
  const apiResponse = await apiService<CartApiResponse>({
    endpoint: endpoints.cart,
  });
  return apiResponse.response as CartApiResponse;
};
