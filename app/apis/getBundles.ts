import { apiService } from "./apiService";
import { endpoints } from "./endpoints";
import { MongoDBDecimal, Product } from "@/app/types/Product";

export interface BundleItem {
  _id: string;
  product: Product;
  variant_sku?: string;
  quantity: number;
}

export interface Bundle {
  _id: string;
  name: string;
  description: string;
  products: BundleItem[];
  price: MongoDBDecimal | number;
  discounted_price: MongoDBDecimal | number;
  images: string[];
  is_active: boolean;
  meta_data?: Record<string, unknown>;
  created_by_admin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BundleParams {
  page: number;
  per_page: number;
  search?: string;
  price_range?: string; // Format: "min_max" e.g., "100_200"
  category?: string[];
  sub_category?: string[];
  rating?: number; // Single rating value (1-5)
  is_best_seller?: boolean;
  brands?: string[];
  sort_by?: "created_at" | "low_to_high" | "high_to_low"; // Updated sort options
}

export interface BundleResponse {
  data: Bundle[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BundleApiResponse {
  success?: boolean;
  data?: Bundle[];
  message?: string;
  statusCode?: number;
}

export const getBundles = async ({ params }: { params?: BundleParams } = {}): Promise<BundleApiResponse> => {
  const apiResponse = await apiService<BundleApiResponse>({
    endpoint: endpoints.bundles,
    params: params,
  });
  
  return apiResponse.response as BundleApiResponse;
};

export interface SingleBundleResponse {
  success?: boolean;
  data?: Bundle;
  message?: string;
}

export const getBundle = async (id: string): Promise<SingleBundleResponse> => {
  const apiResponse = await apiService<SingleBundleResponse>({
    endpoint: `${endpoints.bundles}/${id}`,
  });
  return apiResponse.response as SingleBundleResponse;
}; 