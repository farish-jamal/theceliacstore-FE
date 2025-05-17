import React, { useState } from "react";

const BrandChips = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Brands</h3>
      <div className="flex flex-wrap gap-2">
        {[
          "Schar",
          "Cornitos",
          "Wheafree",
          "Zero G",
          "Nutez Hi",
          "Sai",
          "Mama",
          "Fidalgo",
          "Organ",
          "24 Mantra",
          "APF's",
          "Dr Gluten",
          "Be Well",
        ].map((brand, idx) => (
          <button
            key={idx}
            onClick={() => toggleBrand(brand)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              selectedBrands.includes(brand)
                ? "bg-green-100 border border-green-500 text-green-700"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
      <button className="text-green-600 mt-3 text-xs">More...</button>
    </div>
  );
};

export default BrandChips;
