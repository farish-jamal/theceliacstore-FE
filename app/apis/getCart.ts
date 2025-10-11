import { apiService } from "./apiService";
import { endpoints } from "./endpoints";
import { CartApiResponse } from "@/app/types/Cart";

export const getCart = async (addressId?: string): Promise<CartApiResponse> => {
  const url = addressId ? `${endpoints.cart}?addressId=${addressId}` : endpoints.cart;
  const apiResponse = await apiService<CartApiResponse>({
    endpoint: url,
  });
  return apiResponse.response as CartApiResponse;
};
