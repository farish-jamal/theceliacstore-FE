import React from "react";
import { ShoppingBag } from "lucide-react";

const EmptyCart: React.FC = () => (
  <div className="bg-white rounded-xl p-8 text-center">
    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
    <p className="text-gray-600 mb-6">Add items to start shopping</p>
    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
      Continue Shopping
    </button>
  </div>
);

export default EmptyCart;
