import React from "react";
import { X } from "lucide-react";
import { Category, Brand } from "../../apis/getProducts";

interface ActiveFiltersProps {
  filters: {
    search?: string;
    price_range?: string;
    category?: string[];
    sub_category?: string[];
    rating?: number;
    is_best_seller?: boolean;
    brands?: string[];
    sort_by?: string;
  };
  onRemoveFilter: (key: string, value?: string | number | boolean | string[]) => void;
  categories?: Category[];
  brands?: Brand[];
  subCategories?: Array<{ _id: string; name: string }>;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ 
  filters, 
  onRemoveFilter, 
  categories = [], 
  brands = [],
  subCategories = []
}) => {
  const getFilterIcon = (key: string) => {
    switch (key) {
      case "search":
        return "🔍";
      case "price_range":
        return "💰";
      case "category":
        return "📂";
      case "sub_category":
        return "📁";
      case "rating":
        return "⭐";
      case "is_best_seller":
        return "🏆";
      case "brands":
        return "🏷️";
      case "sort_by":
        return "↕️";
      default:
        return "⚙️";
    }
  };

  // Create separate chips for each category
  const renderCategoryChips = () => {
    if (!filters.category || filters.category.length === 0) return null;
    
    return filters.category.map((categoryId) => {
      const category = categories.find(cat => cat._id === categoryId);
      const categoryName = category?.name || categoryId;
      
      return (
        <div
          key={`category-${categoryId}`}
          className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 group whitespace-nowrap"
        >
          <span className="text-xs opacity-70">📂</span>
          <span className="max-w-32 truncate">{categoryName}</span>
          <button
            onClick={() => {
              const newCategories = filters.category?.filter(id => id !== categoryId) || [];
              onRemoveFilter("category", newCategories);
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100 transition-colors duration-150 opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    });
  };

  // Create separate chips for each subcategory
  const renderSubCategoryChips = () => {
    if (!filters.sub_category || filters.sub_category.length === 0) return null;
    
    return filters.sub_category.map((subCategoryId) => {
      const subCategory = subCategories.find(sub => sub._id === subCategoryId);
      const subCategoryName = subCategory?.name || subCategoryId;
      
      return (
        <div
          key={`subcategory-${subCategoryId}`}
          className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <span className="text-xs opacity-70">📁</span>
          <span className="max-w-32 truncate">{subCategoryName}</span>
          <button
            onClick={() => {
              const newSubCategories = filters.sub_category?.filter(id => id !== subCategoryId) || [];
              onRemoveFilter("sub_category", newSubCategories);
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100 transition-colors duration-150 opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    });
  };

  // Create separate chips for each brand
  const renderBrandChips = () => {
    if (!filters.brands || filters.brands.length === 0) return null;
    
    return filters.brands.map((brandId) => {
      const brand = brands.find(b => b._id === brandId);
      const brandName = brand?.name || brandId;
      
      return (
        <div
          key={`brand-${brandId}`}
          className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <span className="text-xs opacity-70">🏷️</span>
          <span className="max-w-32 truncate">{brandName}</span>
          <button
            onClick={() => {
              const newBrands = filters.brands?.filter(id => id !== brandId) || [];
              onRemoveFilter("brands", newBrands);
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100 transition-colors duration-150 opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    });
  };

  // Create chips for other filters
  const renderOtherFilterChips = () => {
    const otherFilters = Object.entries(filters).filter(([key, value]) => {
      if (key === "page" || key === "per_page") return false;
      if (key === "category" || key === "sub_category" || key === "brands") return false;
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "boolean" && !value) return false;
      return true;
    });

    return otherFilters.map(([key, value]) => {
      let label = "";
      switch (key) {
        case "search":
          label = `"${value}"`;
          break;
        case "price_range":
          if (typeof value === "string") {
            const [min, max] = value.split("_");
            label = `₹${min}-₹${max}`;
          } else {
            label = `${value}`;
          }
          break;
        case "rating":
          label = `${value}★+`;
          break;
        case "is_best_seller":
          label = "Best Sellers";
          break;
        case "sort_by":
          if (typeof value === "string") {
            const sortLabels = {
              created_at: "Latest",
              low_to_high: "Price: Low to High",
              high_to_low: "Price: High to Low"
            };
            label = sortLabels[value as keyof typeof sortLabels] || value;
          } else {
            label = `${value}`;
          }
          break;
        default:
          label = `${value}`;
      }

      return (
        <div
          key={key}
          className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <span className="text-xs opacity-70">{getFilterIcon(key)}</span>
          <span className="max-w-32 truncate">{label}</span>
          <button
            onClick={() => onRemoveFilter(key, value)}
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100 transition-colors duration-150 opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    });
  };

  const hasActiveFilters = 
    (filters.category && filters.category.length > 0) ||
    (filters.sub_category && filters.sub_category.length > 0) ||
    (filters.brands && filters.brands.length > 0) ||
    renderOtherFilterChips().length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-2">
      <div className="flex overflow-x-auto gap-2 pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {renderCategoryChips()}
        {renderSubCategoryChips()}
        {renderBrandChips()}
        {renderOtherFilterChips()}
      </div>
    </div>
  );
};

export default ActiveFilters; 