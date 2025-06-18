import { Blog, BlogParams } from "../types/Blog";
import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export type BlogResponse = {
  success?: boolean;
  data?: {
    total: number;
    data: Blog[];
  };
  message?: string;
};

export type GetBlogsType = {
  params: BlogParams;
};

export const getBlogs = async ({
  params,
}: GetBlogsType): Promise<BlogResponse> => {
  const apiResponse = await apiService<BlogResponse>({
    endpoint: endpoints.blogs,
    params: params,
  });

  return apiResponse.response as BlogResponse;
};
