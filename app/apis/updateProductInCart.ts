import { apiService } from "./apiService";

export interface UpdateCartParams {
  product_id: string;
  quantity: number;
  variant_id?: string;
}

export async function updateProductInCart({ product_id, quantity, variant_id }: UpdateCartParams) {
  return apiService({
    endpoint: "api/cart",
    method: "POST",
    data: { product_id, quantity, variant_id },
  });
}
