import { Product } from "@/app/types/Product";
import { Bundle } from "@/app/apis/getBundles";

/**
 * Type for MongoDB Decimal128 objects
 */
export type MongoDBDecimal = {
  $numberDecimal: string;
};

export type ProductCartItem = {
  _id: string;
  type: "product";
  product: Product;
  quantity: number;
  price: MongoDBDecimal | number;
  total: MongoDBDecimal | number;
  addedAt: string;
  updatedAt: string;
};

export type BundleCartItem = {
  _id: string;
  type: "bundle";
  bundle: string | Bundle; // Can be ID string or full Bundle object
  quantity: number;
  price: MongoDBDecimal | number;
  total: MongoDBDecimal | number;
  addedAt: string;
  updatedAt: string;
};

export type CartItem = ProductCartItem | BundleCartItem;

export type Cart = {
  _id: string;
  user: string;
  items: CartItem[];
  total_price: MongoDBDecimal | number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartApiResponse = {
  data: {
    data: Cart;
    message: string;
    success: boolean;
    statusCode: number;
  };
  message: string;
  success: boolean;
  statusCode: number;
};
