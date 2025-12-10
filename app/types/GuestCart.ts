import { Product } from "@/app/types/Product";
import { Bundle } from "@/app/apis/getBundles";

export interface GuestProductCartItem {
  id: string; // unique identifier for this cart item
  type: "product";
  product: Product;
  quantity: number;
  variant_sku?: string;
  price: number;
  total: number;
  addedAt: string;
}

export interface GuestBundleCartItem {
  id: string;
  type: "bundle";
  bundle: Bundle;
  quantity: number;
  price: number;
  total: number;
  addedAt: string;
}

export type GuestCartItem = GuestProductCartItem | GuestBundleCartItem;

export interface GuestCart {
  items: GuestCartItem[];
  total_price: number;
  shipping_charge: number;
  final_price: number;
}

export interface GuestAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

export interface GuestOrderPayload {
  items: Array<{
    type: "product" | "bundle";
    product_id?: string;
    bundle_id?: string;
    quantity: number;
    variant_sku?: string;
  }>;
  address: GuestAddress;
  guest_email?: string;
}

