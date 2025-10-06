import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export type OrderItemProduct = {
  _id: string;
  name: string;
  price: number;
  discounted_price: number;
  banner_image: string;
  sub_category: string;
};

export type OrderItem = {
  type: "product";
  product: OrderItemProduct;
  quantity: number;
  total_amount: number;
  discounted_total_amount: number;
  _id: string;
};

export type OrderAddress = {
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  _id: string;
};

export type Order = {
  _id: string;
  user: string;
  items: OrderItem[];
  address: OrderAddress;
  totalAmount: number;
  discountedTotalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type OrderHistoryResponse = {
  success?: boolean;
  data?: {
    data: Order[];
    total: number;
  };
  message?: string;
  statusCode?: number;
};

export const getOrderHistory = async (): Promise<OrderHistoryResponse> => {
  const apiResponse = await apiService<OrderHistoryResponse>({
    endpoint: endpoints.orderHistory,
  });
  return apiResponse.response as OrderHistoryResponse;
};


