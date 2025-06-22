import React from "react";

interface BestSellerFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const BestSellerFilter: React.FC<BestSellerFilterProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-800">Best Sellers</h3>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-green-600 w-4 h-4"
        />
        <span className="text-sm text-gray-700">Show best sellers only</span>
      </label>
    </div>
  );
};

export default BestSellerFilter; 