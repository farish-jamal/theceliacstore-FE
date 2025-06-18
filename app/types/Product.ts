export type Product = {
  _id?: string;
  name: string;
  small_description?: string;
  full_description?: string;
  price: number;
  discounted_price?: number | null;
  tags?: (
    | "no_palm_oil"
    | "organic"
    | "no_gmo"
    | "no_aritificial_flavors"
    | "vegan"
    | "sugar_free"
    | "gluten_free"
    | "soya_free"
    | "no_preservatives"
    | "lactose_free"
    | "no_flavor_enhancer"
  )[];
  salesperson_discounted_price?: number | null;
  dnd_discounted_price?: number | null;
  instock?: boolean;
  manufacturer?: string;
  consumed_type?: string;
  banner_image?: string;
  images?: string[];
  expiry_date?: string | Date;
  meta_data?: Record<string, unknown>;
  uploaded_by_brand?: string;
  is_best_seller?: boolean;
  sub_category: string;
  created_by_admin: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductParams = {
  page: number;
  per_page: number;
  category?: string[];
  search?: string;
  sort_by?: "price" | "name" | "createdAt";
  sort_order?: "asc" | "desc";
  tags?: string[];
  brands?: string[];
};
