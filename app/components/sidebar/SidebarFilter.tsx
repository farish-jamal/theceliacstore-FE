import React, { useState } from "react";
import BrandChips, { BrandChipsProps } from "../brandchip/BrandChips";
import { Category, Brand, SubCategory, getSubCategories } from "../../apis/getProducts";

interface SidebarFilterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSubCategory: string;
  onSubCategoryChange: (subCategory: string) => void;
  selectedPrice: number;
  onPriceChange: (price: number) => void;
  selectedRatings: number[];
  onRatingsChange: (ratings: number[]) => void;
  selectedBrands: BrandChipsProps["selectedBrands"];
  onBrandChange: BrandChipsProps["onBrandChange"];
  categories: Category[];
  brands: Brand[];
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  isOpen,
  onClose,
  onCategoryChange,
  selectedSubCategory,
  onSubCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedRatings,
  onRatingsChange,
  selectedBrands,
  onBrandChange,
  categories,
  brands,
}) => {
  const [categorySubCategories, setCategorySubCategories] = useState<Record<string, SubCategory[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = async (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    
    if (newExpandedCategories.has(categoryId)) {
      // Collapse category
      newExpandedCategories.delete(categoryId);
      setExpandedCategories(newExpandedCategories);
    } else {
      // Expand category and fetch sub-categories if not already loaded
      newExpandedCategories.add(categoryId);
      setExpandedCategories(newExpandedCategories);
      
      if (!categorySubCategories[categoryId]) {
        setLoadingStates(prev => ({ ...prev, [categoryId]: true }));
        try {
          const response = await getSubCategories(categoryId);
          setCategorySubCategories(prev => ({ 
            ...prev, 
            [categoryId]: response.data || [] 
          }));
        } catch (error) {
          console.error("Error fetching sub-categories:", error);
          setCategorySubCategories(prev => ({ 
            ...prev, 
            [categoryId]: [] 
          }));
        } finally {
          setLoadingStates(prev => ({ ...prev, [categoryId]: false }));
        }
      }
    }
  };

  const handleSubCategorySelect = (subCategoryId: string, parentCategoryId: string) => {
    if (selectedSubCategory === subCategoryId) {
      // Deselect if already selected
      onSubCategoryChange("");
      onCategoryChange("");
    } else {
      // Select new sub-category
      onSubCategoryChange(subCategoryId);
      onCategoryChange(parentCategoryId);
    }
  };

  const getSelectedCategoryId = () => {
    if (!selectedSubCategory) return "";
    for (const [categoryId, subCats] of Object.entries(categorySubCategories)) {
      if (subCats.some(sub => sub._id === selectedSubCategory)) {
        return categoryId;
      }
    }
    return "";
  };

  const selectedCategoryId = getSelectedCategoryId();

  return (
    <div
      className={`${
        isOpen ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:bg-opacity-0" : ""
      } lg:relative`}
    >
      <div
        className={`
          fixed inset-y-0 left-0 w-[280px] bg-white transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-[260px] lg:shrink-0
        `}
      >
        <div className="p-4 text-sm h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="font-semibold">Filters</h2>
            <button onClick={onClose} className="text-gray-500">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isExpanded = expandedCategories.has(cat._id);
                const subCategories = categorySubCategories[cat._id] || [];
                const isLoading = loadingStates[cat._id];
                const hasSelectedSubCategory = selectedCategoryId === cat._id;
                
                return (
                  <div key={cat._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 ${
                        hasSelectedSubCategory 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleCategory(cat._id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-medium text-sm ${
                          hasSelectedSubCategory ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          {cat.name}
                        </span>
                        {hasSelectedSubCategory && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Sub-categories section - only show when this category is expanded */}
                    {isExpanded && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {isLoading ? (
                          <div className="p-3 text-center">
                            <div className="text-xs text-gray-500">Loading sub-categories...</div>
                          </div>
                        ) : subCategories.length > 0 ? (
                          <div className="p-3 space-y-2">
                            <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                              Sub-Categories
                            </h4>
                            {subCategories.map((subCat) => (
                              <div 
                                key={subCat._id} 
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-white transition-colors"
                              >
                                <input
                                  type="radio"
                                  name="subCategory"
                                  id={subCat._id}
                                  className="accent-green-600 w-3 h-3"
                                  checked={selectedSubCategory === subCat._id}
                                  onChange={() => handleSubCategorySelect(subCat._id, cat._id)}
                                />
                                <label 
                                  htmlFor={subCat._id} 
                                  className={`text-xs cursor-pointer flex-1 ${
                                    selectedSubCategory === subCat._id 
                                      ? 'text-green-700 font-medium' 
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {subCat.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 text-center">
                            <div className="text-xs text-gray-500">No sub-categories available</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Price Range</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <input
                type="range"
                min="50"
                max="1500"
                value={selectedPrice}
                onChange={e => onPriceChange(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <p className="text-xs mt-2 text-gray-600">₹50 — ₹{selectedPrice}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Rating</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div className="flex items-center gap-3" key={rating}>
                  <input
                    type="checkbox"
                    id={`rating-${rating}`}
                    className="accent-green-600 w-4 h-4"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => {
                      if (selectedRatings.includes(rating)) {
                        onRatingsChange(selectedRatings.filter(r => r !== rating));
                      } else {
                        onRatingsChange([...selectedRatings, rating]);
                      }
                    }}
                  />
                  <label htmlFor={`rating-${rating}`} className="text-sm text-gray-700 cursor-pointer">
                    {"★".repeat(rating) + "☆".repeat(5 - rating)} {rating}.0 & up
                  </label>
                </div>
              ))}
            </div>
          </div>

          <BrandChips selectedBrands={selectedBrands} onBrandChange={onBrandChange} brands={brands} />

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center mt-6">
            <p className="text-lg font-semibold text-green-700">Browse</p>
            <p className="text-lg font-semibold text-green-700">Bundles</p>
            <button className="text-green-600 text-sm mt-3 flex items-center justify-center w-full hover:text-green-700 transition-colors">
              Shop Now <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
