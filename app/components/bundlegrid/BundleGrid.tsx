"use client";

import React, { useState } from "react";
import ProductCard from "../cards/ProductCard";
import FilterButton from "../filters/FilterButton";
import SidebarFilter from "../sidebar/SidebarFilter";
import Link from "next/link";
import Pagination from "../pagination/Pagination";

const BundleGrid = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Example bundle data
  const bundles = [
    {
      id: 1,
      name: "Gluten-Free Essentials Bundle",
      price: 499.0,
      image: "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
      savings: "Save 15%",
    },
    {
      id: 2,
      name: "Baking Bundle",
      price: 699.0,
      image: "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
      savings: "Save 20%",
    },
    {
      id: 3,
      name: "Breakfast Bundle",
      price: 399.0,
      image: "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
      savings: "Save 10%",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col mx-[5%]">
        <div className="flex">
          <SidebarFilter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
          <div className="flex-1 py-4">
            <div className="bg-white py-3 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-700">Bundles</span>
            </div>
            <div className="bg-green-500 text-white text-center py-3 text-sm -mx-[5%] mb-5 w-[105%]">
              Save more with our curated bundles
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <p className="text-xs text-gray-600">
                  Showing {bundles.length} bundles
                </p>
              </div>
              <div className="text-xs">
                <label htmlFor="sort" className="mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option>Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Savings: High to Low</option>
                </select>
              </div>
            </div>

            <div className="h-[calc(100vh-40px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="relative">
                    <ProductCard
                      name={bundle.name}
                      price={bundle.price}
                      image={bundle.image}
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      {bundle.savings}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleGrid; 