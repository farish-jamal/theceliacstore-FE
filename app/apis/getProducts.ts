import { Product, ProductParams } from "../types/Product";
import { apiService } from "./apiService";
import { endpoints } from "./endpoints";


export type ProductResponse = {
  success?: boolean;
  data?: {
    total: number;
    data: Product[];
  };
  message?: string;
};

export type GetProductsType = {
  params: ProductParams;
};

export const getProducts = async ({
  params,
}: GetProductsType): Promise<ProductResponse> => {
  const apiResponse = await apiService<ProductResponse>({
    endpoint: endpoints.products,
    params: params,
  });

  console.log("API Response:", apiResponse);

  return apiResponse.response as ProductResponse;
};
