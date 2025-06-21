import React from "react";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, discount, total }) => (
  <div className="border-t-2 pt-4 space-y-3">
    <div className="flex justify-between text-gray-600">
      <span>Subtotal</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>
    {discount > 0 && (
      <div className="flex justify-between text-green-600">
        <span>Discount</span>
        <span>-₹{discount.toFixed(2)}</span>
      </div>
    )}
    <div className="flex justify-between font-semibold text-lg pt-2">
      <span>Total</span>
      <span className="text-green-600">₹{total.toFixed(2)}</span>
    </div>
  </div>
);

export default OrderSummary;
