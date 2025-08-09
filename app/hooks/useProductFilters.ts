import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ProductParams } from "../types/Product";

export const useProductFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current URL parameters
  const currentFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    
    return {
      page: parseInt(params.get("page") || "1"),
      per_page: parseInt(params.get("per_page") || "10"),
      search: params.get("search") || undefined,
      price_range: params.get("price_range") || undefined,
      category: params.get("category") ? params.get("category")!.split(",") : [],
      sub_category: params.get("sub_category") ? params.get("sub_category")!.split(",") : [],
      rating: params.get("rating") ? parseInt(params.get("rating")!) : undefined,
      is_best_seller: params.get("is_best_seller") === "true",
      brands: params.get("brands") ? params.get("brands")!.split(",") : [],
      sort_by: params.get("sort_by") || undefined,
    };
  }, [searchParams]);

  // Update filters and URL
  const updateFilters = useCallback((newFilters: Partial<ProductParams>) => {
    const params = new URLSearchParams(searchParams);
    
    // Update each filter
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 when filters change (except for page changes)
    if (Object.keys(newFilters).some(key => key !== "page")) {
      params.set("page", "1");
    }

    // Update URL
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [searchParams, router, pathname]);

  // Update a single filter
  const updateFilter = useCallback((key: keyof ProductParams, value: ProductParams[keyof ProductParams]) => {
    updateFilters({ [key]: value });
  }, [updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  // Get API params for the backend
  const getApiParams = useMemo((): ProductParams => {
    const params: ProductParams = {
      page: currentFilters.page,
      per_page: currentFilters.per_page,
    };

    if (currentFilters.search) params.search = currentFilters.search;
    if (currentFilters.price_range) params.price_range = currentFilters.price_range;
    if (currentFilters.category) params.category = currentFilters.category;
    if (currentFilters.sub_category) params.sub_category = currentFilters.sub_category;
    if (currentFilters.rating) params.rating = currentFilters.rating;
    if (currentFilters.is_best_seller) params.is_best_seller = currentFilters.is_best_seller;
    if (currentFilters.brands) params.brands = currentFilters.brands;
    if (currentFilters.sort_by) params.sort_by = currentFilters.sort_by as ProductParams["sort_by"];

    return params;
  }, [currentFilters]);

  return {
    filters: currentFilters,
    updateFilters,
    updateFilter,
    clearFilters,
    getApiParams,
  };
}; 