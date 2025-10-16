import React, { useState, useEffect } from "react";
import ProductCard from "../cards/ProductCard";
import FilterButton from "../filters/FilterButton";
import SidebarFilter from "../sidebar/SidebarFilter";
import Link from "next/link";
import Pagination from "../pagination/Pagination";
import { getProducts, getCategories, getBrands, Category, Brand } from "../../apis/getProducts";
import { Product } from "../../types/Product";
import { useProductFilters } from "../../hooks/useProductFilters";
import SortFilter from "../filters/SortFilter";
import ProductGridSkeleton from "../loaders/ProductSkeleton";
import { convertToNumber } from "../../utils/formatPrice";


const ProductGrid = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  // Use URL-driven per_page via filters instead of local state

  // Use the URL-based filtering hook
  const { filters, updateFilter, updateFilters, clearFilters, getApiParams } = useProductFilters();

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ params: getApiParams });
        setProducts(res.data?.data || []);
        setTotalProducts(res.data?.total || 0);
        const effectivePerPage = filters.per_page || 52;
        setTotalPages(Math.ceil((res.data?.total || 1) / effectivePerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getApiParams, filters.per_page]);

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const handleSearchChange = (search: string) => {
    updateFilter("search", search);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    updateFilter("price_range", priceRange);
  };

  const handleCategoryChange = (categories: string[]) => {
    updateFilter("category", categories);
  };

  const handleSubCategoryChange = (subCategories: string[]) => {
    updateFilter("sub_category", subCategories);
  };

  const handleRatingChange = (rating: number | undefined) => {
    updateFilter("rating", rating);
  };

  const handleBestSellerChange = (isBestSeller: boolean) => {
    updateFilter("is_best_seller", isBestSeller);
  };

  const handleImportedPicksChange = (isImportedPicks: boolean) => {
    updateFilter("is_imported_picks", isImportedPicks);
  };

  const handleBakeryChange = (isBakery: boolean) => {
    updateFilter("is_bakery", isBakery);
  };

  const handleBrandChange = (brands: string[]) => {
    updateFilter("brands", brands);
  };

  const handleSortByChange = (sortBy: string) => {
    updateFilter("sort_by", sortBy);
  };

  // Toggle between paginated and all views by adjusting per_page in URL
  const handleViewToggle = (mode: "paginated" | "all") => {
    if (mode === "all") {
      updateFilters({ per_page: totalProducts || 9999 });
    } else {
      updateFilters({ per_page: 52 });
    }
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col mx-2 md:mx-[5%]">
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
            isImportedPicks={filters.is_imported_picks}
            onImportedPicksChange={handleImportedPicksChange}
            isBakery={filters.is_bakery}
            onBakeryChange={handleBakeryChange}
            selectedBrands={filters.brands || []}
            onBrandChange={handleBrandChange}
            categories={categories}
            brands={brands}
            onClearFilters={handleClearFilters}
          />
          <div className="flex-1 pt-0 md:pt-2 pb-4">
            <div className="bg-white py-2 md:py-3 text-xs md:text-sm px-2 md:px-0">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <span className="mx-1 md:mx-2 text-gray-400">›</span>
              <span className="text-gray-700">All Products</span>
            </div>
            <div className="bg-green-500 text-white text-center py-2 md:py-3 text-xs md:text-sm -mx-2 md:-mx-[5%] mb-3 md:mb-5">
              500+ health-first picks, all in one place.
            </div>
            {/* Mobile Layout */}
            <div className="md:hidden mb-4">
              <div className="flex justify-between items-center mb-2">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Sort by:</span>
                  <div className="px-2 py-1 bg-white">
                    <SortFilter value={filters.sort_by || ""} onChange={handleSortByChange} />
                  </div>
                </div>
              </div>
              <div className="flex">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center px-2">
                    {filters.per_page && filters.per_page >= totalProducts
                      ? `Showing all ${totalProducts} products`
                      : `Showing ${((filters.page - 1) * (filters.per_page || 52)) + 1}–${Math.min((filters.page) * (filters.per_page || 52), totalProducts)} of ${totalProducts} products`}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">
                    {filters.per_page && filters.per_page >= totalProducts
                      ? `Showing all ${totalProducts} products`
                      : `Showing ${((filters.page - 1) * (filters.per_page || 52)) + 1}–${Math.min((filters.page) * (filters.per_page || 52), totalProducts)} of ${totalProducts} products`}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex rounded-full border border-gray-200 overflow-hidden text-xs">
                    <button
                      onClick={() => handleViewToggle("paginated")}
                      className={`px-3 py-1 ${(!filters.per_page || (filters.per_page && filters.per_page < totalProducts)) ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                    >
                      Paginated
                    </button>
                    <button
                      onClick={() => handleViewToggle("all")}
                      className={`px-3 py-1 ${filters.per_page && filters.per_page >= totalProducts ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                    >
                      All Products
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Sort by:</span>
                <div className="px-2 py-1 bg-white">
                  <SortFilter value={filters.sort_by || ""} onChange={handleSortByChange} />
                </div>
              </div>
            </div>
            <div className="h-[calc(100vh-40px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {loading ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    {/* Empty State Icon */}
                    <div className="mb-6">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Empty State Text */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      We couldn&apos;t find any products matching your current filters. Try adjusting your search criteria or browse our full collection.
                    </p>

                    {/* Action Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        Clear All Filters
                      </button>
                    </div>

                    {/* Search Tips */}
                    <div className="mt-8 text-sm text-gray-400">
                      <p className="mb-2">Search tips:</p>
                      <ul className="space-y-1 text-left max-w-xs mx-auto">
                        <li>• Try different keywords or product names</li>
                        <li>• Check your spelling</li>
                        <li>• Use broader category filters</li>
                        <li>• Adjust price range</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {products.map((product) => {
                    // Convert MongoDB Decimal objects to numbers for calculations
                    const productPrice = convertToNumber(product.price);
                    const productDiscountedPrice = convertToNumber(product.discounted_price);
                    
                    // Calculate stock status the same way as product detail page
                    const isInStock = product.inventory ? product.inventory > 0 : product.instock;

                    return (
                      <ProductCard
                        key={product._id}
                        name={product.name}
                        price={productDiscountedPrice || productPrice}
                        image={product.banner_image || product.images?.[0] || ""}
                        productId={product._id || ""}
                        tags={product.tags}
                        instock={isInStock}
                        productData={product}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {totalPages > 1 && !(filters.per_page && filters.per_page >= totalProducts) && (
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

export default ProductGrid;
