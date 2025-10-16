"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Typography } from "../typography/Typography";
import { useQuery } from "@tanstack/react-query";
import { getSubCategories, SubCategory } from "../../apis/getProducts";
import { useRouter } from "next/navigation";

const PopularCategories: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const response = await getSubCategories();
      return response.data || [];
    },
  });

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 150;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSubCategoryClick = (subCategory: SubCategory) => {
    router.push(`/products?sub_category=${subCategory._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-6 gap-4 md:gap-8">
        <Typography variant="h1">Popular Categories</Typography>
        <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto px-2 md:px-4">
          <button className="p-1.5 md:p-2 rounded-full bg-white border border-green-500 text-green-500 hover:bg-green-50 flex-shrink-0">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div className="flex overflow-x-auto no-scrollbar space-x-2 md:space-x-3 py-1 px-1 flex-1 md:w-[70vw] max-w-full justify-center">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item} 
                className="px-3 py-1.5 md:px-5 md:py-2 rounded-full border border-gray-200 bg-gray-100 animate-pulse w-24 md:w-32 h-7 md:h-8 flex-shrink-0"
              />
            ))}
          </div>
          <button className="p-1.5 md:p-2 rounded-full bg-white border border-green-500 text-green-500 hover:bg-green-50 flex-shrink-0">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="flex flex-col items-center py-6 px-4 gap-4 md:gap-8">
        <Typography variant="h1">Popular Categories</Typography>
        <div className="text-gray-500">No subcategories available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6 gap-4 md:gap-8">
      <Typography variant="h1">Popular Categories</Typography>

      <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto px-2 md:px-4">
        <button
          onClick={() => scroll("left")}
          className="p-1.5 md:p-2 rounded-full bg-white border border-green-500 text-green-500 hover:bg-green-50 flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div
          ref={containerRef}
          className="flex overflow-x-auto no-scrollbar space-x-2 md:space-x-3 py-1 px-1 flex-1 md:w-[70vw] max-w-full justify-center"
        >
          {data.map((subCategory) => (
            <button
              key={subCategory._id}
              onClick={() => handleSubCategoryClick(subCategory)}
              className="px-3 py-1.5 md:px-5 md:py-2 rounded-full border border-green-500 text-black hover:bg-green-100 text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200"
            >
              {subCategory.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="p-1.5 md:p-2 rounded-full bg-white border border-green-500 text-green-500 hover:bg-green-50 flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default PopularCategories;
