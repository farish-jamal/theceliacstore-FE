import React from "react";
import BrandChips from "../brandchip/BrandChips";

interface SidebarFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ isOpen, onClose }) => (
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
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="gluten-free"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="gluten-free" className="text-gray-700">
              Gluten Free (478)
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="lactose-free"
              defaultChecked
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="lactose-free" className="text-gray-700">
              Lactose Free (190)
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="organic"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="organic" className="text-gray-700">
              Organic (80)
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="snacks"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="snacks" className="text-gray-700">
              Snacks (47)
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="beverages"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="beverages" className="text-gray-700">
              Beverages (44)
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="cookies"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="cookies" className="text-gray-700">
              Cookies (38)
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name="category"
              id="bread"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="bread" className="text-gray-700">
              Bread & Bakery (15)
            </label>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Price</h3>
          <input
            type="range"
            min="50"
            max="1500"
            defaultValue="1500"
            className="w-full accent-green-600"
          />
          <p className="text-xs mt-1">Price: 50 — 1,500</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Rating</h3>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="rating-5"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="rating-5" className="text-gray-700">
              ★★★★★ 5.0
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="rating-4"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="rating-4" className="text-gray-700">
              ★★★★☆ 4.0 & up
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="rating-3"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="rating-3" className="text-gray-700">
              ★★★☆☆ 3.0 & up
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="rating-2"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="rating-2" className="text-gray-700">
              ★★☆☆☆ 2.0 & up
            </label>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="rating-1"
              className="accent-green-600 w-4 h-4"
            />
            <label htmlFor="rating-1" className="text-gray-700">
              ★☆☆☆☆ 1.0 & up
            </label>
          </div>
        </div>

        <BrandChips />

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
