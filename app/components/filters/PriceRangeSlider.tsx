"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Slider } from "../../../components/ui/slider";

interface PriceRangeSliderProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ value, onChange }) => {
  const maxPrice = 5000;
  const [localMin, setLocalMin] = useState(0);
  const [localMax, setLocalMax] = useState(5000);

  // Parse current value on mount
  useEffect(() => {
    if (value) {
      const [min, max] = value.split('_').map(Number);
      setLocalMin(min);
      setLocalMax(max);
    } else {
      setLocalMin(0);
      setLocalMax(5000);
    }
  }, [value]);

  // Debounced onChange function
  const debouncedOnChange = useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout;
        return (min: number, max: number) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            const rangeValue = `${min}_${max}`;
            if (value !== rangeValue) {
              onChange(rangeValue);
            }
          }, 500); // 500ms debounce
        };
      },
      [value, onChange]
    ),
    [value, onChange]
  );

  const handleSliderChange = (values: number[]) => {
    const [min, max] = values;
    setLocalMin(min);
    setLocalMax(max);
    debouncedOnChange(min, max);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localMax - 100);
    setLocalMin(newMin);
    debouncedOnChange(newMin, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localMin + 100);
    setLocalMax(newMax);
    debouncedOnChange(localMin, newMax);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Price Range</h3>
      
      {/* Price Display */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{formatPrice(localMin)}</span>
        <span>{formatPrice(localMax)}</span>
      </div>

      {/* Shadcn Slider */}
      <div className="px-2">
        <Slider
          value={[localMin, localMax]}
          onValueChange={handleSliderChange}
          max={maxPrice}
          min={0}
          step={50}
          className="w-full"
        />
      </div>

      {/* Input Fields */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Min Price</label>
          <input
            type="number"
            value={localMin}
            onChange={handleMinChange}
            min={0}
            max={localMax - 100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Max Price</label>
          <input
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            min={localMin + 100}
            max={maxPrice}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="5000"
          />
        </div>
      </div>

      {/* Clear Filter */}
      {value && (
        <button
          onClick={() => {
            setLocalMin(0);
            setLocalMax(5000);
            onChange("");
          }}
          className="text-xs text-green-600 hover:text-green-700 underline"
        >
          Clear price filter
        </button>
      )}
    </div>
  );
};

export default PriceRangeSlider; 