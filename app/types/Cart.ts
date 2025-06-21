import { Product } from "@/app/types/Product";

export type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
  addedAt: string;
  updatedAt: string;
};

export type Cart = {
  _id: string;
  user: string;
  items: CartItem[];
  total_price: number;
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
