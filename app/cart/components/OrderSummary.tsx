import React from "react";
import { formatPrice } from "@/app/utils/formatPrice";

interface OrderSummaryProps {
  subtotal: number;
  shippingCharge: number;
  finalPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, shippingCharge, finalPrice }) => (
  <div className="border-t-2 pt-4 space-y-3">
    <div className="flex justify-between text-gray-600">
      <span>Subtotal</span>
      <span>₹{formatPrice(subtotal)}</span>
    </div>
    <div className="flex justify-between text-gray-600">
      <span>Shipping Charge</span>
      <span>₹{formatPrice(shippingCharge)}</span>
    </div>
    <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
      <span>Final Price</span>
      <span className="text-green-600">₹{formatPrice(finalPrice)}</span>
    </div>
  </div>
);

export default OrderSummary;
