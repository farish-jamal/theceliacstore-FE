"use client";

import React, { useState, useEffect } from "react";
import BundleCard from "../cards/BundleCard";
import FilterButton from "../filters/FilterButton";
import SidebarFilter from "../sidebar/SidebarFilter";
import Link from "next/link";
import Pagination from "../pagination/Pagination";
import { getBundles, Bundle } from "../../apis/getBundles";
import { getCategories, getBrands, Category, Brand } from "../../apis/getProducts";
import { useBundleFilters } from "../../hooks/useBundleFilters";
import SortFilter from "../filters/SortFilter";
import { convertToNumber } from "@/app/utils/formatPrice";
import BundleGridSkeleton from "../loaders/BundleSkeleton";

const PER_PAGE = 10;

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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Use the URL-based filtering hook
  const { filters, updateFilter, clearFilters, getApiParams } = useBundleFilters();

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
        const apiParams = getApiParams;
        console.log("Fetching bundles with params:", apiParams);
        
        const res = await getBundles({ params: apiParams });
        console.log("Bundles API Response:", res);
        console.log("Response type:", typeof res);
        console.log("Response.data type:", typeof res.data);
        console.log("Is res.data an array?", Array.isArray(res.data));
        if (res.data && typeof res.data === 'object') {
          console.log("res.data keys:", Object.keys(res.data));
          console.log("res.data.data type:", typeof (res.data as unknown as Record<string, unknown>).data);
          console.log("Is res.data.data an array?", Array.isArray((res.data as unknown as Record<string, unknown>).data));
        }
        
        // Handle different possible response structures
        let bundlesData: Bundle[] = [];
        if (res.data && Array.isArray(res.data)) {
          // Direct array response
          bundlesData = res.data;
          console.log("Using direct array response");
        } else if (res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray((res.data as { data: Bundle[] }).data)) {
          // Nested data structure: { data: { data: [...] } }
          bundlesData = (res.data as { data: Bundle[] }).data;
          console.log("Using nested data response");
        } else if (Array.isArray(res)) {
          // Response is directly an array
          bundlesData = res;
          console.log("Using direct response as array");
        } else {
          console.error("Unexpected bundles response structure:", res);
          setError("Invalid response format from server");
          setBundles([]);
          setTotalPages(1);
          return;
        }
        
        console.log("Extracted bundles data:", bundlesData);
        setBundles(bundlesData);
        setTotalPages(Math.ceil((bundlesData.length || 1) / PER_PAGE));
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
  }, [getApiParams]);

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const handleSearchChange = (search: string) => {
    updateFilter("search", search);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    updateFilter("price_range", priceRange);
  };

  const handleCategoryChange = (category: string[]) => {
    updateFilter("category", category);
  };

  const handleSubCategoryChange = (subCategory: string[]) => {
    updateFilter("sub_category", subCategory);
  };

  const handleRatingChange = (rating: number | undefined) => {
    updateFilter("rating", rating);
  };

  const handleBestSellerChange = (isBestSeller: boolean) => {
    updateFilter("is_best_seller", isBestSeller);
  };

  const handleBrandChange = (brands: string[]) => {
    updateFilter("brands", brands);
  };

  const handleSortByChange = (sortBy: string) => {
    updateFilter("sort_by", sortBy);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col mx-[5%]">
        <div className="flex">
          <SidebarFilter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            search={filters.search || ""}
            onSearchChange={handleSearchChange}
            priceRange={filters.price_range || ""}
            onPriceRangeChange={handlePriceRangeChange}
            category={filters.category || []}
            onCategoryChange={handleCategoryChange}
            subCategory={filters.sub_category || []}
            onSubCategoryChange={handleSubCategoryChange}
            rating={filters.rating}
            onRatingChange={handleRatingChange}
            isBestSeller={filters.is_best_seller}
            onBestSellerChange={handleBestSellerChange}
            selectedBrands={filters.brands || []}
            onBrandChange={handleBrandChange}
            categories={categories}
            brands={brands}
            onClearFilters={handleClearFilters}
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
            
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <p className="text-xs text-gray-600">
                  Showing {((filters.page - 1) * PER_PAGE) + 1}–{Math.min(filters.page * PER_PAGE, bundles.length)} of {bundles.length} bundles
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Sort by:</span>
                <SortFilter value={filters.sort_by || ""} onChange={handleSortByChange} />
              </div>
            </div>

            <div className="h-[calc(100vh-40px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {loading ? (
                <BundleGridSkeleton />
              ) : !Array.isArray(bundles) || bundles.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No bundles found matching your filters.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-2 text-green-600 hover:text-green-700 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {bundles.map((bundle) => {
                    // Convert MongoDB Decimal objects to numbers for calculations
                    const bundlePrice = convertToNumber(bundle.price);
                    const bundleDiscountedPrice = convertToNumber(bundle.discounted_price);
                    
                    return (
                      <BundleCard
                        key={bundle._id}
                        name={bundle.name}
                        price={bundleDiscountedPrice || bundlePrice}
                        originalPrice={bundlePrice}
                        image={bundle.images?.[0] || ""}
                        bundleId={bundle._id}
                        productCount={bundle.products?.length || 0}
                        tags={[]}
                        bundleData={bundle}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleGrid; 