import React from "react";

const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 items-center border-b py-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-20 h-20 bg-gray-200 rounded"></div>
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      
      {/* Quantity skeleton */}
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
      
      {/* Price skeleton */}
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  );
};

const CartItemsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
      <CartItemSkeleton />
      <CartItemSkeleton />
      <CartItemSkeleton />
    </div>
  );
};

export default CartItemsSkeleton;

