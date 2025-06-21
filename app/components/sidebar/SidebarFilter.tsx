import React from "react";
import BrandChips, { BrandChipsProps } from "../brandchip/BrandChips";
import { Category, Brand } from "../../apis/getProducts";

interface SidebarFilterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
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
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedRatings,
  onRatingsChange,
  selectedBrands,
  onBrandChange,
  categories,
  brands,
}) => (
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

        <div className="mb-4">
          <h3 className="font-semibold mb-2">All Categories</h3>
          {categories.map((cat) => (
            <div className="flex items-center gap-2 mb-1" key={cat._id}>
              <input
                type="radio"
                name="category"
                id={cat._id}
                className="accent-green-600 w-4 h-4"
                checked={selectedCategory === cat._id}
                onChange={() => onCategoryChange(cat._id)}
              />
              <label htmlFor={cat._id} className="text-gray-700">
                {cat.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Price</h3>
          <input
            type="range"
            min="50"
            max="1500"
            value={selectedPrice}
            onChange={e => onPriceChange(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <p className="text-xs mt-1">Price: 50 — {selectedPrice}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Rating</h3>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div className="flex items-center gap-2 mb-1" key={rating}>
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
              <label htmlFor={`rating-${rating}`} className="text-gray-700">
                {"★".repeat(rating) + "☆".repeat(5 - rating)} {rating}.0 & up
              </label>
            </div>
          ))}
        </div>

        <BrandChips selectedBrands={selectedBrands} onBrandChange={onBrandChange} brands={brands} />

        <div className="bg-[#f9f9f9] border border-red-100 rounded p-3 text-center h-40">
          <p className="text-2xl font-semibold text-red-600">Browse</p>
          <p className="text-2xl font-semibold text-red-600">Bundles</p>
          <button className="text-green-600 text-sm mt-5 flex items-center justify-center w-full">
            Shop Now <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SidebarFilter;
