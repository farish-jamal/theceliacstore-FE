"use client";

import React from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

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

  const getCurrentLabel = () => {
    const currentOption = sortOptions.find(option => option.value === value);
    return currentOption ? currentOption.label : "Sort by";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <ArrowUpDown className="w-3 h-3" />
          {getCurrentLabel()}
          <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortFilter; 