import React from "react";
import { Loader2 } from "lucide-react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-200 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Price skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

const ProductGridSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Loading header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <h3 className="text-lg font-semibold text-gray-700">Loading Products</h3>
        </div>
        <p className="text-sm text-gray-500">Finding the best gluten-free products for you...</p>
      </div>
      
      {/* Skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductGridSkeleton; 