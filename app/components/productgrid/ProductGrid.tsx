import React, { useState, useEffect } from "react";
import ProductCard from "../cards/ProductCard";
import FilterButton from "../filters/FilterButton";
import SidebarFilter from "../sidebar/SidebarFilter";
import Link from "next/link";
import Pagination from "../pagination/Pagination";
import { getProducts, getCategories, getBrands, Category, Brand } from "../../apis/getProducts";
import { Product, ProductParams } from "../../types/Product";

const DEFAULT_PRICE = 1500;
const PER_PAGE = 36;

const ProductGrid = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: ProductParams = {
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
        const res = await getProducts({ params });
        setProducts(res.data?.data || []);
        setTotalPages(Math.ceil((res.data?.total || 1) / PER_PAGE));
      } catch {
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedSubCategory, selectedPrice, selectedRatings, selectedBrands, sortBy, currentPage]);

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
              <span className="text-gray-700">All Products</span>
            </div>
            <div className="bg-green-500 text-white text-center py-3 text-sm -mx-[5%] mb-5 w-[105%]">
              500+ health-first picks, all in one place.
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <FilterButton onClick={() => setIsFilterOpen(true)} />
                <p className="text-xs text-gray-600">
                  Showing 1–{products.length} of {products.length} products
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
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      name={product.name}
                      price={product.discounted_price ?? product.price}
                      image={product.banner_image || product.images?.[0] || ""}
                      productId={product._id || ""}
                      tags={product.tags}
                    />
                  ))}
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

export default ProductGrid;
