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

const PER_PAGE = 10;

const ProductGrid = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Use the URL-based filtering hook
  const { filters, updateFilter, clearFilters, getApiParams } = useProductFilters();

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
        const apiParams = getApiParams;
        console.log("Fetching products with params:", apiParams);
        
        const res = await getProducts({ params: apiParams });
        setProducts(res.data?.data || []);
        setTotalPages(Math.ceil((res.data?.total || 1) / PER_PAGE));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  const handleCategoryChange = (category: string) => {
    updateFilter("category", category);
  };

  const handleSubCategoryChange = (subCategory: string) => {
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
            category={filters.category || ""}
            onCategoryChange={handleCategoryChange}
            subCategory={filters.sub_category || ""}
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
              <span className="text-gray-700">All Products</span>
            </div>
            <div className="bg-green-500 text-white text-center py-3 text-sm -mx-[5%] mb-5 w-[105%]">
              500+ health-first picks, all in one place.
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <p className="text-xs text-gray-600">
                  Showing {((filters.page - 1) * PER_PAGE) + 1}–{Math.min(filters.page * PER_PAGE, products.length)} of {products.length} products
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Sort by:</span>
                <SortFilter value={filters.sort_by} onChange={handleSortByChange} />
              </div>
            </div>
            <div className="h-[calc(100vh-40px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No products found matching your filters.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-2 text-green-600 hover:text-green-700 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      name={product.name}
                      price={product.discounted_price ?? product.price}
                      image={product.banner_image || product.images?.[0] || ""}
                      productId={product._id || ""}
                      tags={product.tags}
                      instock={product.instock}
                    />
                  ))}
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

export default ProductGrid;
