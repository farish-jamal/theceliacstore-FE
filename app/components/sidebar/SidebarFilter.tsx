"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Category, Brand, SubCategory, getSubCategories } from "../../apis/getProducts";
import SearchFilter from "../filters/SearchFilter";
import PriceRangeSlider from "../filters/PriceRangeSlider";
import RatingFilter from "../filters/RatingFilter";
import { useRouter } from "next/navigation";

interface SidebarFilterProps {
  isOpen: boolean;
  onClose: () => void;
  // URL-based filter values
  search: string;
  onSearchChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  category: string[];
  onCategoryChange: (category: string[]) => void;
  subCategory: string[];
  onSubCategoryChange: (subCategory: string[]) => void;
  rating: number | undefined;
  onRatingChange: (rating: number | undefined) => void;
  isBestSeller: boolean;
  onBestSellerChange: (value: boolean) => void;
  isImportedPicks: boolean;
  onImportedPicksChange: (value: boolean) => void;
  isBakery: boolean;
  onBakeryChange: (value: boolean) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  categories: Category[];
  brands: Brand[];
  onClearFilters: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  isOpen,
  onClose,
  search,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  category,
  onCategoryChange,
  subCategory,
  onSubCategoryChange,
  rating,
  onRatingChange,
  isBestSeller,
  onBestSellerChange,
  isImportedPicks,
  onImportedPicksChange,
  isBakery,
  onBakeryChange,
  selectedBrands,
  onBrandChange,
  categories,
  brands,
  onClearFilters,
}) => {
  const router = useRouter();

  const [categorySubCategories, setCategorySubCategories] = useState<Record<string, SubCategory[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Auto-expand categories when sub-categories are selected
  useEffect(() => {
    if (subCategory.length > 0) {
      // Find which categories have selected sub-categories
      const categoriesToExpand = new Set<string>();

      // For each selected sub-category, find its parent category and expand it
      subCategory.forEach(subCatId => {
        // Find the parent category for this sub-category
        categories.forEach(cat => {
          if (categorySubCategories[cat._id]) {
            const hasSubCategory = categorySubCategories[cat._id].some(subCat => subCat._id === subCatId);
            if (hasSubCategory) {
              categoriesToExpand.add(cat._id);
            }
          }
        });
      });

      // Expand the categories and fetch sub-categories if needed
      categoriesToExpand.forEach(async (catId) => {
        if (!expandedCategories.has(catId)) {
          setExpandedCategories(prev => new Set([...prev, catId]));

          // Fetch sub-categories if not already loaded
          if (!categorySubCategories[catId]) {
            setLoadingStates(prev => ({ ...prev, [catId]: true }));
            try {
              const response = await getSubCategories(catId);
              setCategorySubCategories(prev => ({
                ...prev,
                [catId]: response.data || []
              }));
            } catch (error) {
              console.error("Error fetching sub-categories:", error);
              setCategorySubCategories(prev => ({
                ...prev,
                [catId]: []
              }));
            } finally {
              setLoadingStates(prev => ({ ...prev, [catId]: false }));
            }
          }
        }
      });
    }
  }, [subCategory, categories, categorySubCategories, expandedCategories]);

  const handleImportedPicksChange = (checked: boolean | "indeterminate") => {
    setIsImportedPicks(checked === true);
  };

  const handleBakeryDelhiChange = (checked: boolean | "indeterminate") => {
    setIsBakeryDelhi(checked === true);
  };

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

  const handleBrowseBundlesClick = () => {
    router.push('/bundles');
  };

  return (
    <div
      className={`${isOpen ? "fixed inset-0 z-50 lg:bg-opacity-0" : ""
        } lg:relative`}
    >
      <div
        className={`
          fixed inset-y-0 left-0 w-full bg-white transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-full lg:shrink-0
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

          {/* Search Filter */}
          <div className="mb-4">
            <SearchFilter
              value={search}
              onChange={(value) => {
                console.log("SidebarFilter onSearchChange called with:", value);
                onSearchChange(value);
              }}
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isExpanded = expandedCategories.has(cat._id);
                const subCategories = categorySubCategories[cat._id] || [];
                const isLoading = loadingStates[cat._id];
                const isCategorySelected = category.includes(cat._id);

                return (
                  <div key={cat._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div
                      className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 ${isCategorySelected
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white hover:bg-gray-50'
                        }`}
                      onClick={() => toggleCategory(cat._id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`category-${cat._id}`}
                          checked={isCategorySelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onCategoryChange([...category, cat._id]);
                              // Auto-expand category when selected
                              if (!expandedCategories.has(cat._id)) {
                                const newExpandedCategories = new Set(expandedCategories);
                                newExpandedCategories.add(cat._id);
                                setExpandedCategories(newExpandedCategories);

                                // Fetch sub-categories if not already loaded
                                if (!categorySubCategories[cat._id]) {
                                  setLoadingStates(prev => ({ ...prev, [cat._id]: true }));
                                  getSubCategories(cat._id).then(response => {
                                    setCategorySubCategories(prev => ({
                                      ...prev,
                                      [cat._id]: response.data || []
                                    }));
                                  }).catch(error => {
                                    console.error("Error fetching sub-categories:", error);
                                    setCategorySubCategories(prev => ({
                                      ...prev,
                                      [cat._id]: []
                                    }));
                                  }).finally(() => {
                                    setLoadingStates(prev => ({ ...prev, [cat._id]: false }));
                                  });
                                }
                              }
                            } else {
                              onCategoryChange(category.filter(id => id !== cat._id));
                              // Auto-collapse category when deselected
                              if (expandedCategories.has(cat._id)) {
                                const newExpandedCategories = new Set(expandedCategories);
                                newExpandedCategories.delete(cat._id);
                                setExpandedCategories(newExpandedCategories);
                              }
                            }
                          }}
                          className="border-gray-400 data-[state=checked]:border-green-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`category-${cat._id}`}
                          className={`font-medium text-sm cursor-pointer ${isCategorySelected ? 'text-green-700' : 'text-gray-700'
                            }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {cat.name}
                        </label>
                        {isCategorySelected && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
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
                                <Checkbox
                                  id={subCat._id}
                                  className="border-gray-400 data-[state=checked]:border-green-600"
                                  checked={subCategory.includes(subCat._id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      onSubCategoryChange([...subCategory, subCat._id]);
                                      if (!category.includes(cat._id)) {
                                        onCategoryChange([...category, cat._id]);
                                      }
                                    } else {
                                      onSubCategoryChange(subCategory.filter(id => id !== subCat._id));
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={subCat._id}
                                  className={`text-xs cursor-pointer flex-1 ${subCategory.includes(subCat._id)
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

          {/* Quick Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Quick Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="best-sellers"
                  checked={isBestSeller}
                  onCheckedChange={onBestSellerChange}
                  className="border-gray-400 data-[state=checked]:border-green-600"
                />
                <label htmlFor="best-sellers" className="text-sm cursor-pointer text-gray-700">
                  Best Sellers
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="imported-picks"
                  checked={isImportedPicks}
                  onCheckedChange={onImportedPicksChange}
                  className="border-gray-400 data-[state=checked]:border-green-600"
                />
                <label htmlFor="imported-picks" className={`text-sm cursor-pointer text-gray-700 ${isImportedPicks ? 'text-green-700 font-medium' : ''}`}>
                  Imported Picks
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="bakery"
                  checked={isBakery}
                  onCheckedChange={onBakeryChange}
                  className="border-gray-400 data-[state=checked]:border-green-600"
                />
                <label htmlFor="bakery" className={`text-sm cursor-pointer text-gray-700 ${isBakery ? 'text-green-700 font-medium' : ''}`}>
                  Bakery
                </label>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <PriceRangeSlider value={priceRange} onChange={onPriceRangeChange} />
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <RatingFilter value={rating} onChange={onRatingChange} />
          </div>

          {/* Brands */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Brands</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {brands.map((brand) => (
                <div key={brand._id} className="flex items-center gap-3">
                  <Checkbox
                    id={`brand-${brand._id}`}
                    checked={selectedBrands.includes(brand._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onBrandChange([...selectedBrands, brand._id]);
                      } else {
                        onBrandChange(selectedBrands.filter(id => id !== brand._id));
                      }
                    }}
                    className="border-gray-400 data-[state=checked]:border-green-600"
                  />
                  <label htmlFor={`brand-${brand._id}`} className="text-sm cursor-pointer text-gray-700">
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mb-6">
            <button
              onClick={onClearFilters}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center mt-6">
            <p className="text-lg font-semibold text-green-700">Browse</p>
            <p className="text-lg font-semibold text-green-700">Bundles</p>
            <button
              onClick={handleBrowseBundlesClick}
              className="text-green-600 text-sm mt-3 flex items-center justify-center w-full hover:text-green-700 transition-colors"
            >
              Shop Now <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
