import React from "react";

const BrandSkeleton = () => {
  return (
    <div className="w-full lg:w-[70%] mx-auto rounded-lg bg-white">
      <div className="flex items-center justify-center gap-4 p-4">
        {/* Skeleton for 6 brand items */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 animate-pulse"
          >
            {/* Brand logo skeleton */}
            <div className="w-20 h-16 bg-gray-200 rounded mb-2"></div>
            {/* Brand name skeleton */}
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSkeleton;
