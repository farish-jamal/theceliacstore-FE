export type Blog = {
  _id?: string;
  title: string;
  content: string;
  short_description: string;
  banner_image_url: string;
  author: string; 
  published?: boolean;
  is_featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogParams = {
  page: number;
  per_page: number;
};
