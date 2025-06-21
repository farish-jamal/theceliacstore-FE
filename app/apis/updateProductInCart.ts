import { apiService } from "./apiService";

export interface UpdateCartParams {
  product_id: string;
  quantity: number;
}

export async function updateProductInCart({ product_id, quantity }: UpdateCartParams) {
  return apiService({
    endpoint: "api/cart",
    method: "POST",
    data: { product_id, quantity },
  });
}
