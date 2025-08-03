import React from "react";

interface SortFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ value, onChange }) => {
  const sortOptions = [
    { value: "created_at", label: "Latest" },
    { value: "low_to_high", label: "Price: Low to High" },
    { value: "high_to_low", label: "Price: High to Low" },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortFilter; 