"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Typography } from "../typography/Typography";
import { ProductParams } from "@/app/types/Product";

const categories = [
  "Bestsellers",
  "Essentials",
  "Noodles",
  "Health Foods",
  "Baking Essentials",
  "Cookies",
  "Snacks",
  "Beverages",
  "Frozen Foods",
  "Condiments",
  "Sauces",
  "Spices",
];

type PopularCategoriesProps = {
  params: ProductParams;
  setParams: React.Dispatch<React.SetStateAction<ProductParams>>;
};

const PopularCategories: React.FC<PopularCategoriesProps> = ({
  params,
  setParams,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 150;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 gap-8">
      <Typography variant="h1">Popular Categories</Typography>

      <div className="flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-white border border-green-500 text-green-500 hover:bg-green-50"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={containerRef}
          className="flex overflow-x-auto no-scrollbar space-x-3 py-1 px-1 w-[70vw] max-w-full"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setParams((prev) => ({ ...prev, category }))}
              className={`px-5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200
                ${
                  params.category === category
                    ? "bg-green-500 text-white"
                    : "border-green-500 text-black hover:bg-green-100"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-white border border-green-500 text-green-500 hover:bg-green-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PopularCategories;
