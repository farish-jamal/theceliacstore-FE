"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "../typography/Typography";
import { getCategories } from "../../apis/getCategories";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  description: string;
  discount_label_text?: string;
  meta_data?: Record<string, unknown>;
  newly_launched?: boolean;
  is_active?: boolean;
  images: string[];
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded background colors mapper
const bgColorMapper = {
  0: "bg-green-100",
  1: "bg-blue-100", 
  2: "bg-yellow-100",
};

const DietaryNeeds: React.FC = () => {
  const router = useRouter();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Take only first 3 categories as requested
  const categories = data?.data?.categories || [];

  const handleCategoryClick = (category: Category) => {
    router.push(`/products?category=${category._id}`);
  };

  if (isLoading) {
    return (
      <section aria-labelledby="dietary-heading" className="py-6 md:py-10">
        <div className="text-center mb-4 md:mb-8">
          <Typography variant="h1">Your Dietary Needs</Typography>
          <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
        </div>
        <ul className="flex flex-row flex-wrap items-center justify-center md:justify-evenly gap-4 md:gap-10 max-w-6xl mx-auto px-4">
          {[1, 2, 3].map((item) => (
            <li key={item} className="flex flex-col items-center relative w-40 md:w-56 h-48 md:h-64">
              <div className="bg-gray-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-24 w-24 md:h-44 md:w-44 animate-pulse" />
              <div className="flex-1 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="h-5 md:h-6 bg-gray-200 rounded w-24 md:w-32 animate-pulse mt-2 md:mt-4" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-labelledby="dietary-heading" className="py-10">
        <div className="text-center mb-8">
          <Typography variant="h1">Your Dietary Needs</Typography>
          <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
        </div>
        <div className="flex justify-center">
          <div className="text-red-500">Error loading categories</div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="dietary-heading" className="py-6 md:py-10">
      <div className="text-center mb-4 md:mb-8">
        <Typography variant="h1">Your Dietary Needs</Typography>
        <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
      </div>

      <ul className="flex flex-row flex-wrap items-center justify-center md:justify-evenly gap-4 md:gap-10 max-w-6xl mx-auto px-4">
        {categories.map((category: Category, idx: number) => (
          <li
            key={category._id}
            className="flex flex-col items-center relative w-40 md:w-56 h-48 md:h-64 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => handleCategoryClick(category)}
          >
            <div
              className={`${bgColorMapper[idx as keyof typeof bgColorMapper] || "bg-gray-200"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-24 w-24 md:h-44 md:w-44 z-[-1]`}
            />
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={category.images?.[0] || "/multigrain.png"}
                alt={category.name}
                width={120}
                height={120}
                className="object-contain relative z-10 rounded-lg w-20 h-20 md:w-[120px] md:h-[120px]"
              />
            </div>
            <h3 className="text-base md:text-xl font-medium text-gray-700 text-center mt-2 md:mt-4">
              {category.name}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DietaryNeeds;
