import React from "react";

interface PriceRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ value, onChange }) => {
  const priceRanges = [
    { label: "Under ₹100", value: "0_100" },
    { label: "₹100 - ₹200", value: "100_200" },
    { label: "₹200 - ₹500", value: "200_500" },
    { label: "₹500 - ₹1000", value: "500_1000" },
    { label: "₹1000 - ₹2000", value: "1000_2000" },
    { label: "Above ₹2000", value: "2000_9999" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-800">Price Range</h3>
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <label key={range.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              value={range.value}
              checked={value === range.value}
              onChange={(e) => onChange(e.target.value)}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-xs text-green-600 hover:text-green-700 underline"
        >
          Clear price filter
        </button>
      )}
    </div>
  );
};

export default PriceRangeFilter; 