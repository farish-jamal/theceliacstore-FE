"use client";

import React, { useState, useEffect } from "react";
import BundleCard from "../cards/BundleCard";
import FilterButton from "../filters/FilterButton";
import SidebarFilter from "../sidebar/SidebarFilter";
import Link from "next/link";
import Pagination from "../pagination/Pagination";
import { getBundles, Bundle, BundleParams } from "../../apis/getBundles";
import { getCategories, getBrands, Category, Brand } from "../../apis/getProducts";

const DEFAULT_PRICE = 1500;
const PER_PAGE = 36;

// Fallback bundle data for when API is not available
const fallbackBundles: Bundle[] = [
  {
    _id: "fallback-1",
    name: "Gluten-Free Essentials Bundle",
    description: "A carefully curated collection of essential gluten-free products for your daily needs.",
    products: [],
    price: 1000,
    discounted_price: 800,
    images: ["/product-1.png"],
    is_active: true,
    meta_data: {},
    created_by_admin: "",
    createdAt: "",
    updatedAt: "",
    __v: 0
  },
  {
    _id: "fallback-2", 
    name: "Baking Bundle",
    description: "Everything you need for gluten-free baking in one convenient package.",
    products: [],
    price: 1200,
    discounted_price: 950,
    images: ["/product-1.png"],
    is_active: true,
    meta_data: {},
    created_by_admin: "",
    createdAt: "",
    updatedAt: "",
    __v: 0
  },
  {
    _id: "fallback-3",
    name: "Breakfast Bundle", 
    description: "Start your day right with our nutritious gluten-free breakfast essentials.",
    products: [],
    price: 800,
    discounted_price: 650,
    images: ["/product-1.png"],
    is_active: true,
    meta_data: {},
    created_by_admin: "",
    createdAt: "",
    updatedAt: "",
    __v: 0
  }
];

const BundleGrid = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(DEFAULT_PRICE);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands();
        setBrands(res.data?.brands || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: BundleParams = {
          page: currentPage,
          per_page: PER_PAGE,
        };
        if (selectedCategory) params.category = [selectedCategory];
        if (selectedSubCategory) params.sub_category = [selectedSubCategory];
        if (sortBy && sortBy !== "latest") {
          if (sortBy === "price_asc") {
            params.sort_by = "price";
            params.sort_order = "asc";
          } else if (sortBy === "price_desc") {
            params.sort_by = "price";
            params.sort_order = "desc";
          }
        }
        if (selectedBrands.length > 0) params.brands = selectedBrands;
        const res = await getBundles({ params });
        console.log("Bundles API Response:", res); // Debug log
        console.log("Bundles data:", res.data); // Debug log
        console.log("Bundles length:", res.data?.length); // Debug log
        setBundles(res.data || []);
        setTotalPages(Math.ceil((res.data?.length || 1) / PER_PAGE));
      } catch (err) {
        console.error("Error fetching bundles:", err);
        setError("Unable to load bundles. Showing sample data.");
        // Use fallback data when API fails
        setBundles(fallbackBundles);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, [selectedCategory, selectedSubCategory, selectedPrice, selectedRatings, selectedBrands, sortBy, currentPage]);

  console.log("Current bundles state:", bundles); // Debug log

  return (
    <div className="min-h-screen">
      <div className="flex flex-col mx-[5%]">
        <div className="flex">
          <SidebarFilter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            selectedSubCategory={selectedSubCategory}
            onSubCategoryChange={(subCat) => {
              setSelectedSubCategory(subCat);
              setCurrentPage(1);
            }}
            selectedPrice={selectedPrice}
            onPriceChange={(price) => {
              setSelectedPrice(price);
              setCurrentPage(1);
            }}
            selectedRatings={selectedRatings}
            onRatingsChange={(ratings) => {
              setSelectedRatings(ratings);
              setCurrentPage(1);
            }}
            selectedBrands={selectedBrands}
            onBrandChange={(brands) => {
              setSelectedBrands(brands);
              setCurrentPage(1);
            }}
            categories={categories}
            brands={brands}
          />
          <div className="flex-1 py-4 ">
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
            
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <p className="text-xs text-gray-600">
                  Showing 1–{bundles.length} of {bundles.length} bundles
                </p>
              </div>
              <div className="text-xs">
                <label htmlFor="sort" className="mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="border border-gray-300 rounded px-2 py-1"
                  value={sortBy}
                  onChange={e => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div className="h-[calc(100vh-40px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {bundles.map((bundle) => {
                    // Aggregate all unique tags from all products in the bundle
                    const allTags = bundle.products?.reduce((acc: string[], product) => {
                      if (product.tags) {
                        product.tags.forEach(tag => {
                          if (!acc.includes(tag)) {
                            acc.push(tag);
                          }
                        });
                      }
                      return acc;
                    }, []) || [];

                    return (
                      <BundleCard
                        key={bundle._id}
                        name={bundle.name}
                        price={bundle.discounted_price ?? bundle.price}
                        originalPrice={bundle.price}
                        image={bundle.images?.[0] || ""}
                        bundleId={bundle._id}
                        productCount={bundle.products?.length || 0}
                        tags={allTags}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleGrid; 