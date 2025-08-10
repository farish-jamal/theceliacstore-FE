import { Product, ProductParams } from "../types/Product";
import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  discount_label_text?: string;
  meta_data?: Record<string, unknown>;
  newly_launched?: boolean;
  is_active?: boolean;
  images?: string[];
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryResponse = {
  success?: boolean;
  data?: {
    total: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
    categories: Category[];
  };
  message?: string;
};

export const getCategories = async (): Promise<CategoryResponse> => {
  const apiResponse = await apiService<CategoryResponse>({
    endpoint: endpoints.categories,
  });
  return apiResponse.response as CategoryResponse;
};

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

  return apiResponse.response as ProductResponse;
};

export type Brand = {
  _id: string;
  name: string;
  description?: string;
  meta_data?: Record<string, unknown>;
  newly_launched?: boolean;
  is_active?: boolean;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type BrandResponse = {
  success?: boolean;
  data?: {
    total: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
    brands: Brand[];
  };
  message?: string;
};

export const getBrands = async (): Promise<BrandResponse> => {
  const apiResponse = await apiService<BrandResponse>({
    endpoint: endpoints.brands,
  });
  return apiResponse.response as BrandResponse;
};

export type SingleProductResponse = {
  success?: boolean;
  data?: Product;
  message?: string;
};

export const getProduct = async (id: string): Promise<SingleProductResponse> => {
  const apiResponse = await apiService<SingleProductResponse>({
    endpoint: `${endpoints.products}/${id}`,
  });
  return apiResponse.response as SingleProductResponse;
};

export type SubCategory = {
  _id: string;
  name: string;
  description?: string;
  category?: Category | null;
  meta_data?: Record<string, unknown>;
  is_active?: boolean;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type SubCategoryResponse = {
  success?: boolean;
  data?: SubCategory[];
  message?: string;
};

export const getSubCategories = async (categoryId?: string): Promise<SubCategoryResponse> => {
  const endpoint = categoryId 
    ? `${endpoints.subCategories}?category=${categoryId}`
    : endpoints.subCategories;
    
  const apiResponse = await apiService<SubCategoryResponse>({
    endpoint,
  });
  return apiResponse.response as SubCategoryResponse;
};
