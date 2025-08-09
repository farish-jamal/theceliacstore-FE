"use client";

import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <div className="bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery Skeleton */}
          <div className="w-full lg:w-[45%]">
            <div className="flex gap-6">
              {/* Thumbnails skeleton */}
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
              {/* Main image skeleton */}
              <div className="flex-1 aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Right: Product Info Skeleton */}
          <div className="w-full lg:w-[55%] space-y-6">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>

            {/* Badge skeleton */}
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>

            {/* Price skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Brand section skeleton */}
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4/6 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Variant selection skeleton */}
            <div className="space-y-3">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-16 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Stock info skeleton */}
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-8">
          <div className="flex border-b justify-center items-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="px-6 py-3 w-32 h-8 bg-gray-200 rounded animate-pulse mx-2"
              ></div>
            ))}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 py-8 px-[10%]">
            {/* Left column skeleton */}
            <div className="w-full lg:w-1/2 space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="flex">
                  <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-4 w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
              <div className="mt-6 w-64 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Right column skeleton */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="aspect-square w-96 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton; 