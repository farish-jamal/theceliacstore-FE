export type Variant = {
  _id: string;
  name: string;
  price: number;
  discounted_price?: number | null;
  inventory: number;
  sku?: string;
  images?: string[];
};

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
  inventory?: number;
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
  variants?: Variant[];
};

export type ProductParams = {
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
};
