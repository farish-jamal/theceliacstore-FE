import React from "react";

const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 items-center border-b py-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-20 h-20 bg-gray-200 rounded"></div>
      
      {/* Content skeleton */}
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      
      {/* Quantity controls skeleton */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
      
      {/* Price skeleton */}
      <div className="h-5 bg-gray-200 rounded w-16"></div>
    </div>
  );
};

const CartItemsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="h-7 bg-gray-200 rounded w-32 mb-6"></div>
      <CartItemSkeleton />
      <CartItemSkeleton />
      <CartItemSkeleton />
    </div>
  );
};

export default CartItemsSkeleton;

