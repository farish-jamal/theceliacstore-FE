import { apiService } from "./apiService";
import { endpoints } from "./endpoints";
import { GuestAddress } from "@/app/types/GuestCart";

export interface PlaceOrderPayload {
  cartId: string;
  addressId: string;
}

export interface GuestOrderItem {
  type: "product" | "bundle";
  product_id?: string;
  bundle_id?: string;
  quantity: number;
  variant_sku?: string;
}

export interface GuestPlaceOrderPayload {
  items: GuestOrderItem[];
  address: GuestAddress;
  guest_email?: string;
}

export interface ProductItem {
  _id: string;
  name: string;
  price: number;
  discounted_price: number;
  banner_image: string;
  sub_category: string;
}

export interface BundleItem {
  _id: string;
  name: string;
  price: number;
  discounted_price: number;
  images: string[];
  description: string;
  products: Array<{
    product: string;
    variant_sku?: string;
    quantity: number;
    _id: string;
  }>;
}

export interface OrderItem {
  type: "product" | "bundle";
  product?: ProductItem;
  bundle?: BundleItem;
  quantity: number;
  total_amount: number;
  discounted_total_amount: number;
  _id: string;
}

export interface OrderAddress {
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  _id: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    user: string;
    items: OrderItem[];
    address: OrderAddress;
    totalAmount: number;
    discountedTotalAmount: number;
    status: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export const placeOrder = async (
  payload: PlaceOrderPayload
): Promise<PlaceOrderResponse> => {
  const apiResponse = await apiService<PlaceOrderResponse>({
    endpoint: endpoints.order,
    method: "POST",
    data: payload,
  });

  return apiResponse.response as PlaceOrderResponse;
};

// Guest order placement
export const placeGuestOrder = async (
  payload: GuestPlaceOrderPayload
): Promise<PlaceOrderResponse> => {
  const apiResponse = await apiService<PlaceOrderResponse>({
    endpoint: endpoints.guestOrder,
    method: "POST",
    data: payload,
    removeToken: true,
  });

  return apiResponse.response as PlaceOrderResponse;
};