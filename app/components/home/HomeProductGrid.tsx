"use client";

import React, { useState, useEffect, useRef } from "react";
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
import SidebarFilter from "@/app/components/sidebar/SidebarFilter";
import { useProductFilters } from "@/app/hooks/useProductFilters";
import { cloudinaryThumb } from "@/app/utils/cloudinary";

const ITEMS_PER_PAGE = 12;

const categoryPills = [
  "All",
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
  priority?: boolean;
}

function ProductCardItem({ product, priority = false }: ProductCardItemProps) {
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
  const outOfStock = product.inventory === 0;

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
        <img
          src={cloudinaryThumb(imageUrl)}
          alt={product.name}
          width={400}
          height={400}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="w-full h-full object-cover"
        />
        {outOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 z-10">
            Out of Stock
          </div>
        )}
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
            className={`w-5 h-5 border rounded text-xs flex items-center justify-center ${outOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={outOfStock}
          >
            {"\u2212"}
          </button>
          <span className="text-xs w-4 text-center">{quantity}</span>
          <button
            className={`w-5 h-5 border rounded text-xs flex items-center justify-center ${outOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setQuantity((q) => q + 1)}
            disabled={outOfStock}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding || outOfStock}
          className={`w-full bg-[#2d6a4f] text-white text-[10px] py-1.5 rounded disabled:opacity-50 ${outOfStock ? "cursor-not-allowed" : ""}`}
        >
          {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
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
  const dispatch = useAppDispatch();
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
        const cats = res.data?.categories || [];
        const priorityOrder = ['Gluten Free', 'Lactose Free', 'Organic'];
        cats.sort((a: Category, b: Category) => {
          const ai = priorityOrder.indexOf(a.name);
          const bi = priorityOrder.indexOf(b.name);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return 0;
        });
        setCategories(cats);
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
    // Only touch the URL when the category actually changes. Writing the same value
    // re-rendered the URL as "/?page=1" and fetched the product list a second time on every visit.
    const current = filters.category || [];
    if (dietaryFilter && nameMap[dietaryFilter]) {
      const cat = categories.find((c) => c.name === nameMap[dietaryFilter]);
      if (cat && !(current.length === 1 && current[0] === cat._id)) {
        updateFilter("category", [cat._id]);
      }
    } else if (dietaryFilter === null && current.length > 0) {
      updateFilter("category", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dietaryFilter, categories]);

  // Fetch products using shared filter params.
  // First paint asks for one page only (was per_page 500 = 1.6 MB JSON, 2.6 s server time).
  // The full list is fetched only when a visitor needs it: Load more, the "All" toggle, or the search box.
  const [fullLoaded, setFullLoaded] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  // requestIdRef changes whenever the filters change; replies for old filters are dropped.
  const requestIdRef = useRef(0);
  const fullLoadedForRef = useRef(-1); // request id whose full list is loaded
  const loadingAllForRef = useRef(-1); // request id whose full list is in flight

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const fetchFirstPage = async () => {
      setLoading(true);
      setFullLoaded(false);
      try {
        // Always page 1: the homepage paginates on the client, so a stray ?page=N must not offset the list.
        const params = { ...getApiParams, page: 1, per_page: ITEMS_PER_PAGE };
        const res = await getProducts({ params });
        if (requestId !== requestIdRef.current) return;
        if (fullLoadedForRef.current === requestId) return; // full list already arrived
        const data = res?.data?.data || [];
        const total = res?.data?.total || data.length;
        setProducts(data);
        setTotalProducts(total);
        if (data.length >= total) {
          fullLoadedForRef.current = requestId;
          setFullLoaded(true);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) console.error("Failed to fetch products:", err);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    };
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiParams]);

  // Returns true only if the full list for the current filters is in place.
  const loadAllProducts = async (): Promise<boolean> => {
    const requestId = requestIdRef.current;
    if (fullLoadedForRef.current === requestId) return true;
    if (loadingAllForRef.current === requestId) return false;
    loadingAllForRef.current = requestId;
    setLoadingAll(true);
    try {
      const params = { ...getApiParams, page: 1, per_page: 500 };
      const res = await getProducts({ params });
      if (requestId !== requestIdRef.current) return false;
      // apiService swallows network errors and returns no data. Keep what is on screen
      // and leave the list marked "not loaded" so the visitor can retry.
      if (!Array.isArray(res?.data?.data)) {
        dispatch(showSnackbar({ message: "Couldn't load more products. Please try again.", type: "error" }));
        return false;
      }
      const data = res.data.data;
      setProducts(data);
      setTotalProducts(res?.data?.total || data.length);
      fullLoadedForRef.current = requestId;
      setFullLoaded(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to fetch products:", err);
      return false;
    } finally {
      if (loadingAllForRef.current === requestId) {
        loadingAllForRef.current = -1;
        setLoadingAll(false);
      }
    }
  };

  // Search filters the full list locally, and the "All" view shows the full list,
  // so (re)load it whenever either is active and the filters change.
  useEffect(() => {
    if (searchQuery || !paginatedView) loadAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, paginatedView, getApiParams]);

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
          {loading || (searchQuery && !fullLoaded && loadingAll) ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2" aria-busy="true" aria-label="Loading products">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-square max-h-[140px] md:max-h-[200px] bg-gray-100" />
                  <div className="p-2">
                    <div className="h-3 bg-gray-100 rounded mb-1" />
                    <div className="h-3 w-2/3 bg-gray-100 rounded mb-1" />
                    <div className="h-4 w-1/3 bg-gray-100 rounded mb-1" />
                    <div className="h-2 w-1/4 bg-gray-100 rounded mb-1" />
                    <div className="h-5 w-16 bg-gray-100 rounded mb-1.5" />
                    <div className="h-6 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No products found. Try adjusting your filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {displayedProducts.map((product, i) => (
                  <ProductCardItem key={product._id} product={product} priority={i < 4} />
                ))}
              </div>

              {!paginatedView && !fullLoaded && loadingAll && (
                <p className="text-center text-xs text-gray-500 mt-4">Loading all products...</p>
              )}

              {!searchQuery && paginatedView && visibleCount < (fullLoaded ? products.length : totalProducts) && (
                <div className="text-center mt-4">
                  <button
                    onClick={async () => {
                      // Only grow the page if the full list for these same filters is in place;
                      // a filter change mid-load resets the count and must not be undone here.
                      const ok = await loadAllProducts();
                      if (ok) setVisibleCount((c) => c + ITEMS_PER_PAGE);
                    }}
                    disabled={loadingAll}
                    className="bg-[#2d6a4f] text-white text-sm px-6 py-2 rounded-full hover:bg-[#1b4332] transition-colors"
                  >
                    {loadingAll ? "Loading..." : "Load more"}
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
