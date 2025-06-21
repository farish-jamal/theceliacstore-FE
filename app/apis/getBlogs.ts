import { Blog, BlogParams } from "../types/Blog";
import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export type BlogResponse = {
  success?: boolean;
  data?: Blog[];
  message?: string;
  statusCode?: number;
};

export type SingleBlogResponse = {
  success?: boolean;
  data?: Blog;
  message?: string;
  statusCode?: number;
};

export type GetBlogsType = {
  params?: BlogParams;
};

export const getBlogs = async ({
  params,
}: GetBlogsType = {}): Promise<BlogResponse> => {
  const apiResponse = await apiService<BlogResponse>({
    endpoint: endpoints.blogs,
    params: params,
  });

  return apiResponse.response as BlogResponse;
};

export const getBlogById = async (id: string): Promise<SingleBlogResponse> => {
  const apiResponse = await apiService<SingleBlogResponse>({
    endpoint: `${endpoints.blogs}/${id}`,
  });

  return apiResponse.response as SingleBlogResponse;
};
