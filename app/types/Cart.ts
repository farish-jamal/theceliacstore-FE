import { Product } from "@/app/types/Product";

/**
 * Type for MongoDB Decimal128 objects
 */
export type MongoDBDecimal = {
  $numberDecimal: string;
};

export type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
  price: MongoDBDecimal | number;
  total: MongoDBDecimal | number;
  addedAt: string;
  updatedAt: string;
};

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
