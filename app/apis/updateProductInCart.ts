import { apiService } from "./apiService";

export interface UpdateCartParams {
  product_id?: string;
  bundle_id?: string;
  quantity: number;
  variant_id?: string;
  type: 'product' | 'bundle';
}

export async function updateProductInCart({ product_id, bundle_id, quantity, variant_id, type }: UpdateCartParams) {
  const data: { quantity: number; type: string; product_id?: string; bundle_id?: string; variant_id?: string } = { 
    quantity, 
    type 
  };
  
  if (type === 'product') {
    data.product_id = product_id;
    if (variant_id) {
      data.variant_id = variant_id;
    }
  } else if (type === 'bundle') {
    data.bundle_id = bundle_id;
  }

  return apiService({
    endpoint: "api/cart",
    method: "POST",
    data,
  });
}
