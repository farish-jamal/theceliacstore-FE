"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { setGuestCart } from "@/app/slices/guestCartSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { addProductToGuestCart } from "@/app/utils/guestCart";
import { getProducts } from "@/app/apis/getProducts";
import { Product, ProductParams } from "@/app/types/Product";
import { convertToNumber, formatCurrency } from "@/app/utils/formatPrice";
import { Check, Search, X, SlidersHorizontal } from "lucide-react";
import PrimaryLoader from "@/app/components/loaders/PrimaryLoader";

const ITEMS_PER_PAGE = 12;

const categoryPills = [
  "All",
  "Indian Snacks",
  "Pasta",
  "Noodles",
  "Flour",
  "Sauces",
  "Sweets",
  "Soup",
  "Cereals",
  "Supplements",
  "Rusk",
  "Milk Replacement",
];

const sidebarBrands = [
  "Yes You Can",
  "Bewell",
  "Pure Food",
  "Nutri Org",
  "Life Oats",
  "Chilzo",
  "Wheafree",
  "Chef Urbano",
  "BRB",
];

interface ProductCardItemProps {
  product: Product;
}

function ProductCardItem({ product }: ProductCardItemProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: updateProductInCart,
    onSuccess: (response) => {
      const cartResponse = response?.response as { success: boolean; message?: string };
      if (cartResponse?.success) {
        dispatch(showSnackbar({ message: "Product added to cart successfully!", type: "success" }));
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        dispatch(showSnackbar({ message: cartResponse?.message || "Failed to add product to cart", type: "error" }));
      }
    },
    onError: () => {
      dispatch(showSnackbar({ message: "Failed to add product to cart. Please try again.", type: "error" }));
    },
    onSettled: () => setIsAdding(false),
  });

  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);

    if (auth.user && auth.token) {
      addToCartMutation.mutate({ product_id: product._id || "", quantity, type: "product" });
    } else {
      try {
        const updatedCart = addProductToGuestCart(product, quantity);
        dispatch(setGuestCart(updatedCart));
        dispatch(showSnackbar({ message: "Product added to cart successfully!", type: "success" }));
      } catch {
        dispatch(showSnackbar({ message: "Failed to add product to cart.", type: "error" }));
      }
      setIsAdding(false);
    }
  };

  const price = convertToNumber(product.discounted_price) || convertToNumber(product.price);
  const imageUrl = product.banner_image || (product.images && product.images[0]) || "/product-1.png";
  const celiacFriendly = product.tags?.includes("gluten_free");

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="relative aspect-square max-h-[140px] md:max-h-[200px] bg-gray-50 cursor-pointer overflow-hidden"
        onClick={() => product._id && router.push(`/products/${product._id}`)}
      >
        {celiacFriendly && (
          <span className="absolute top-1.5 left-1.5 bg-[#1b4332] text-[#d8f3dc] text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 z-10">
            <Check size={8} /> Celiac Friendly
          </span>
        )}
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-2">
        <p className="text-xs leading-tight mb-1 line-clamp-2">{product.name}</p>
        <p className="text-sm font-medium text-[#1b4332]">{"\u20B9"}{formatCurrency(price)}</p>
        <p className="text-[9px] text-gray-400 mb-1">incl. all taxes</p>
        <div className="flex items-center gap-1 mb-1.5">
          <button
            className="w-5 h-5 border rounded text-xs flex items-center justify-center"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            {"\u2212"}
          </button>
          <span className="text-xs w-4 text-center">{quantity}</span>
          <button
            className="w-5 h-5 border rounded text-xs flex items-center justify-center"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-[#2d6a4f] text-white text-[10px] py-1.5 rounded disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

interface HomeProductGridProps {
  dietaryFilter?: string | null;
}

export default function HomeProductGrid({ dietaryFilter }: HomeProductGridProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<ProductParams["sort_by"]>("created_at");
  const [sidebarFilters, setSidebarFilters] = useState({
    organic: false,
    glutenFree: false,
    lactoseFree: false,
    bestSellers: false,
    importedPicks: false,
    selectedBrands: [] as string[],
    priceMin: 0,
    priceMax: 5000,
  });
  const [paginatedView, setPaginatedView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync dietary tile filter with sidebar checkboxes
  useEffect(() => {
    setSidebarFilters((prev) => ({
      ...prev,
      glutenFree: dietaryFilter === "glutenFree",
      lactoseFree: dietaryFilter === "lactoseFree",
      organic: dietaryFilter === "organic",
    }));
  }, [dietaryFilter]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: ProductParams = {
        page: 1,
        per_page: 100,
        sort_by: sortBy,
      };

      if (selectedCategory !== "All") {
        params.search = selectedCategory;
      }

      if (sidebarFilters.bestSellers) params.is_best_seller = true;
      if (sidebarFilters.importedPicks) params.is_imported_picks = true;

      if (sidebarFilters.priceMin > 0 || sidebarFilters.priceMax < 5000) {
        params.price_range = `${sidebarFilters.priceMin}_${sidebarFilters.priceMax}`;
      }

      if (sidebarFilters.selectedBrands.length > 0) {
        params.brands = sidebarFilters.selectedBrands;
      }

      const res = await getProducts({ params });
      let data: Product[] = [];
      if (res?.data) {
        data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTotalProducts(Array.isArray(res.data) ? data.length : res.data.total || data.length);
      }

      // Client-side tag filtering
      if (sidebarFilters.organic) data = data.filter((p) => p.tags?.includes("organic"));
      if (sidebarFilters.glutenFree) data = data.filter((p) => p.tags?.includes("gluten_free"));
      if (sidebarFilters.lactoseFree) data = data.filter((p) => p.tags?.includes("lactose_free"));

      setProducts(data);
      setTotalProducts(data.length);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, sidebarFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, sortBy, sidebarFilters]);

  const searchedProducts = searchQuery
    ? products.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;
  const displayedProducts = searchQuery
    ? searchedProducts
    : paginatedView
    ? products.slice(0, visibleCount)
    : products;
  const showingFrom = displayedProducts.length > 0 ? 1 : 0;
  const showingTo = displayedProducts.length;
  const showingTotal = searchQuery ? searchedProducts.length : totalProducts;

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSortBy("created_at");
    setSidebarFilters({
      organic: false,
      glutenFree: false,
      lactoseFree: false,
      bestSellers: false,
      importedPicks: false,
      selectedBrands: [],
      priceMin: 0,
      priceMax: 5000,
    });
  };

  const toggleBrand = (brand: string) => {
    setSidebarFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4">
        {/* Left Sidebar - hidden on mobile */}
        <aside className="hidden md:block w-44 flex-shrink-0 space-y-4 text-xs">
          {/* Categories */}
          <div>
            <p className="font-semibold mb-2 text-sm">Categories</p>
            {["Organic", "Gluten Free", "Lactose Free"].map((cat) => {
              const key = cat === "Organic" ? "organic" : cat === "Gluten Free" ? "glutenFree" : "lactoseFree";
              return (
                <label key={cat} className="flex items-center gap-2 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sidebarFilters[key]}
                    onChange={() => setSidebarFilters((p) => ({ ...p, [key]: !p[key] }))}
                    className="rounded border-gray-300 text-green-600"
                  />
                  {cat}
                </label>
              );
            })}
          </div>

          {/* Quick filters */}
          <div>
            <p className="font-semibold mb-2 text-sm">Quick filters</p>
            {[
              { label: "Best Sellers", key: "bestSellers" as const },
              { label: "Imported Picks", key: "importedPicks" as const },
            ].map(({ label, key }) => (
              <label key={key} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sidebarFilters[key]}
                  onChange={() => setSidebarFilters((p) => ({ ...p, [key]: !p[key] }))}
                  className="rounded border-gray-300 text-green-600"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Price range */}
          <div>
            <p className="font-semibold mb-2 text-sm">Price range</p>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={sidebarFilters.priceMin}
                onChange={(e) => setSidebarFilters((p) => ({ ...p, priceMin: Number(e.target.value) }))}
                className="w-16 border rounded px-1 py-0.5 text-xs"
                min={0}
              />
              <span>-</span>
              <input
                type="number"
                value={sidebarFilters.priceMax}
                onChange={(e) => setSidebarFilters((p) => ({ ...p, priceMax: Number(e.target.value) }))}
                className="w-16 border rounded px-1 py-0.5 text-xs"
                min={0}
              />
            </div>
          </div>

          {/* Brands */}
          <div>
            <p className="font-semibold mb-2 text-sm">Brands</p>
            {sidebarBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sidebarFilters.selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-gray-300 text-green-600"
                />
                {brand}
              </label>
            ))}
          </div>

          {/* Clear all */}
          <button onClick={clearAllFilters} className="text-red-500 text-xs underline">
            Clear all filters
          </button>

          {/* Browse Bundles card */}
          <div
            className="bg-[#eaf6f0] rounded-lg p-3 cursor-pointer hover:bg-[#d8f3dc] transition-colors"
            onClick={() => router.push("/bundles")}
          >
            <p className="font-semibold text-sm text-[#1b4332]">Browse Bundles</p>
            <p className="text-[10px] text-[#2d6a4f] mt-1">Save more with curated packs</p>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-xs text-gray-500">
              Showing {showingFrom}–{showingTo} of {showingTotal} products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginatedView(!paginatedView)}
                className={`text-[10px] px-2 py-1 rounded border ${paginatedView ? "bg-[#2d6a4f] text-white border-[#2d6a4f]" : "border-gray-300"}`}
              >
                {paginatedView ? "Paginated" : "All"}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ProductParams["sort_by"])}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="created_at">Newest</option>
                <option value="low_to_high">Price: Low to High</option>
                <option value="high_to_low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#2d6a4f]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            className="md:hidden flex items-center gap-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 mb-2"
            onClick={() => setFilterDrawerOpen(true)}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categoryPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setSelectedCategory(pill)}
                className={`whitespace-nowrap text-xs px-3 py-1 rounded-full border transition-colors ${
                  selectedCategory === pill
                    ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                    : "border-gray-300 text-gray-600 hover:border-[#2d6a4f]"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {loading ? (
            <PrimaryLoader />
          ) : displayedProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No products found. Try adjusting your filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {displayedProducts.map((product) => (
                  <ProductCardItem key={product._id} product={product} />
                ))}
              </div>

              {!searchQuery && paginatedView && visibleCount < products.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                    className="bg-[#2d6a4f] text-white text-sm px-6 py-2 rounded-full hover:bg-[#1b4332] transition-colors"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setFilterDrawerOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm">Filters</p>
              <button onClick={() => setFilterDrawerOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Categories */}
              <div>
                <p className="font-semibold mb-2 text-sm">Categories</p>
                {["Organic", "Gluten Free", "Lactose Free"].map((cat) => {
                  const key = cat === "Organic" ? "organic" : cat === "Gluten Free" ? "glutenFree" : "lactoseFree";
                  return (
                    <label key={cat} className="flex items-center gap-2 mb-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sidebarFilters[key]}
                        onChange={() => setSidebarFilters((p) => ({ ...p, [key]: !p[key] }))}
                        className="rounded border-gray-300 text-green-600"
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>

              {/* Quick filters */}
              <div>
                <p className="font-semibold mb-2 text-sm">Quick filters</p>
                {[
                  { label: "Best Sellers", key: "bestSellers" as const },
                  { label: "Imported Picks", key: "importedPicks" as const },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sidebarFilters[key]}
                      onChange={() => setSidebarFilters((p) => ({ ...p, [key]: !p[key] }))}
                      className="rounded border-gray-300 text-green-600"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* Price range */}
              <div>
                <p className="font-semibold mb-2 text-sm">Price range</p>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={sidebarFilters.priceMin}
                    onChange={(e) => setSidebarFilters((p) => ({ ...p, priceMin: Number(e.target.value) }))}
                    className="w-16 border rounded px-1 py-0.5 text-xs"
                    min={0}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={sidebarFilters.priceMax}
                    onChange={(e) => setSidebarFilters((p) => ({ ...p, priceMax: Number(e.target.value) }))}
                    className="w-16 border rounded px-1 py-0.5 text-xs"
                    min={0}
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <p className="font-semibold mb-2 text-sm">Brands</p>
                {sidebarBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sidebarFilters.selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-gray-300 text-green-600"
                    />
                    {brand}
                  </label>
                ))}
              </div>

              {/* Clear all */}
              <button onClick={clearAllFilters} className="text-red-500 text-xs underline">
                Clear all filters
              </button>
            </div>

            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="w-full mt-4 bg-[#2d6a4f] text-white text-sm py-2.5 rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
