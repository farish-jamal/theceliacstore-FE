import { apiService } from './apiService';

export interface Brand {
  _id: string;
  name: string;
  description: string;
  meta_data: Record<string, unknown>;
  newly_launched: boolean;
  is_active: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BrandsResponse {
  data: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    brands: Brand[];
  };
  message: string;
  success: boolean;
  statusCode: number;
}

export const getBrands = async (): Promise<BrandsResponse> => {
  try {
    const response = await apiService({
      endpoint: 'api/brand',
      method: 'GET'
    });
    
    if ('error' in response) {
      throw new Error('Failed to fetch brands');
    }
    
    return response.response as BrandsResponse;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
}; 