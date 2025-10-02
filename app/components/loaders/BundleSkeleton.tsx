import React from "react";
import { Loader2 } from "lucide-react";

const BundleSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute top-2 right-2 bg-gray-300 rounded-full w-8 h-8" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        
        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
};

const BundleGridSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Loading header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <h3 className="text-lg font-semibold text-gray-700">Loading Bundles</h3>
        </div>
        <p className="text-sm text-gray-500">Finding the best bundles for you...</p>
      </div>
      
      {/* Skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <BundleSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default BundleGridSkeleton; 