export type Blog = {
  _id?: string;
  title: string;
  content: string;
  short_description: string;
  banner_image_url: string;
  author: {
    _id: string;
    name: string;
    email: string;
    role: string;
    services: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  published?: boolean;
  is_featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type BlogParams = {
  page: number;
  per_page: number;
};
