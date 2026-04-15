"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { setGuestCart } from "@/app/slices/guestCartSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { addProductToGuestCart } from "@/app/utils/guestCart";
import { getProducts, getCategories, getBrands, Category, Brand } from "@/app/apis/getProducts";
import { Product, ProductParams } from "@/app/types/Product";
import { convertToNumber, formatCurrency } from "@/app/utils/formatPrice";
import { Check, Search, X, SlidersHorizontal } from "lucide-react";
import PrimaryLoader from "@/app/components/loaders/PrimaryLoader";
import SidebarFilter from "@/app/components/sidebar/SidebarFilter";
import { useProductFilters } from "@/app/hooks/useProductFilters";

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
  const celiacFriendly = product.celiacFriendly || product.tags?.includes("gluten_free");

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
        <p
          className="text-xs leading-tight mb-1 line-clamp-2 cursor-pointer hover:underline hover:text-[#2d6a4f]"
          onClick={() => product._id && router.push(`/products/${product._id}`)}
        >{product.name}</p>
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
  const { filters, updateFilter, clearFilters, getApiParams } = useProductFilters();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [paginatedView, setPaginatedView] = useState(true);

  // Fetch categories from API (same as shop page)
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCats();
  }, []);

  // Fetch brands from API (same as shop page)
  useEffect(() => {
    const fetchBr = async () => {
      try {
        const res = await getBrands();
        setBrands(res.data?.brands || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBr();
  }, []);

  // Sync dietary tile filter → category filter in SidebarFilter
  useEffect(() => {
    if (!categories.length) return;
    const nameMap: Record<string, string> = {
      glutenFree: "Gluten Free",
      lactoseFree: "Lactose Free",
      organic: "Organic",
    };
    if (dietaryFilter && nameMap[dietaryFilter]) {
      const cat = categories.find((c) => c.name === nameMap[dietaryFilter]);
      if (cat) {
        updateFilter("category", [cat._id]);
      }
    } else if (dietaryFilter === null) {
      updateFilter("category", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dietaryFilter, categories]);

  // Fetch products using shared filter params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { ...getApiParams, per_page: 500 };
        const res = await getProducts({ params });
        const data = res?.data?.data || [];

        // Debug logs (FIX 2 diagnosis)
        console.log("[HomeProductGrid] dietaryFilter:", dietaryFilter);
        if (data.length > 0) {
          console.log("[HomeProductGrid] sample product:", JSON.stringify(data[0], null, 2));
        }

        setProducts(data);
        setTotalProducts(res?.data?.total || data.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [getApiParams]);

  // Derived display data
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

  // Category pill active state
  const activePill = filters.search || "All";

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4">
        {/* Left Sidebar — same SidebarFilter as shop page */}
        <SidebarFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          search={filters.search || ""}
          onSearchChange={(v) => updateFilter("search", v)}
          priceRange={filters.price_range || ""}
          onPriceRangeChange={(v) => updateFilter("price_range", v)}
          category={filters.category || []}
          onCategoryChange={(v) => updateFilter("category", v)}
          subCategory={filters.sub_category || []}
          onSubCategoryChange={(v) => updateFilter("sub_category", v)}
          rating={filters.rating}
          onRatingChange={(v) => updateFilter("rating", v)}
          isBestSeller={filters.is_best_seller}
          onBestSellerChange={(v) => updateFilter("is_best_seller", v)}
          isImportedPicks={filters.is_imported_picks}
          onImportedPicksChange={(v) => updateFilter("is_imported_picks", v)}
          isBakery={filters.is_bakery}
          onBakeryChange={(v) => updateFilter("is_bakery", v)}
          selectedBrands={filters.brands || []}
          onBrandChange={(v) => updateFilter("brands", v)}
          categories={categories}
          brands={brands}
          onClearFilters={clearFilters}
        />

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
                value={filters.sort_by || "created_at"}
                onChange={(e) => updateFilter("sort_by", e.target.value)}
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
            className="lg:hidden flex items-center gap-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 mb-2"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categoryPills.map((pill) => (
              <button
                key={pill}
                onClick={() => updateFilter("search", pill === "All" ? undefined : pill)}
                className={`whitespace-nowrap text-xs px-3 py-1 rounded-full border transition-colors ${
                  activePill === pill
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
    </section>
  );
}
