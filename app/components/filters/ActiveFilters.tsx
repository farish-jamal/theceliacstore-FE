import React from "react";
import { X } from "lucide-react";
import { Category, Brand } from "../../apis/getProducts";

interface ActiveFiltersProps {
  filters: {
    search?: string;
    price_range?: string;
    category?: string;
    sub_category?: string;
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
  const getFilterLabel = (key: string, value: string | number | boolean | string[]) => {
    switch (key) {
      case "search":
        return `"${value}"`;
      case "price_range":
        if (typeof value === "string") {
          const [min, max] = value.split("_");
          return `₹${min}-₹${max}`;
        }
        return `${value}`;
      case "category":
        if (typeof value === "string") {
          const category = categories.find(cat => cat._id === value);
          return category?.name || value;
        }
        return `${value}`;
      case "sub_category":
        if (typeof value === "string") {
          const subCategory = subCategories.find(sub => sub._id === value);
          return subCategory?.name || value;
        }
        return `${value}`;
      case "rating":
        return `${value}★+`;
      case "is_best_seller":
        return "Best Sellers";
      case "brands":
        if (Array.isArray(value)) {
          const brandNames = value.map(brandId => {
            const brand = brands.find(b => b._id === brandId);
            return brand?.name || brandId;
          });
          return brandNames.join(", ");
        }
        return `${value}`;
      case "sort_by":
        if (typeof value === "string") {
          const sortLabels = {
            created_at: "Latest",
            low_to_high: "Price: Low to High",
            high_to_low: "Price: High to Low"
          };
          return sortLabels[value as keyof typeof sortLabels] || value;
        }
        return `${value}`;
      default:
        return `${value}`;
    }
  };

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

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "per_page") return false;
    if (value === undefined || value === null || value === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === "boolean" && !value) return false;
    return true;
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <span className="text-xs opacity-70">{getFilterIcon(key)}</span>
            <span className="max-w-32 truncate">{getFilterLabel(key, value)}</span>
            <button
              onClick={() => onRemoveFilter(key, value)}
              className="ml-1 p-0.5 rounded-full hover:bg-gray-100 transition-colors duration-150 opacity-60 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters; 