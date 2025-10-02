import React from "react";
import { Brand } from "../../apis/getProducts";

export type BrandChipsProps = {
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  brands: Brand[];
};

const BrandChips: React.FC<BrandChipsProps> = ({ selectedBrands, onBrandChange, brands }) => {
  const toggleBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onBrandChange(selectedBrands.filter((b) => b !== brandId));
    } else {
      onBrandChange([...selectedBrands, brandId]);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Brands</h3>
      <div className="flex flex-wrap gap-2">
        {brands.map((brand) => (
          <button
            key={brand._id}
            onClick={() => toggleBrand(brand._id)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              selectedBrands.includes(brand._id)
                ? "bg-green-100 border border-green-500 text-green-700"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandChips;
