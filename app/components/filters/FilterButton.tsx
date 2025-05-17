import React from "react";

interface FilterButtonProps {
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm lg:hidden"
  >
    Filter
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M6 12h12M9 18h6" />
    </svg>
  </button>
);

export default FilterButton;
