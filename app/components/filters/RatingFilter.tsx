import React from "react";

interface RatingFilterProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ value, onChange }) => {
  const ratings = [
    { value: 5, label: "5★ & up" },
    { value: 4, label: "4★ & up" },
    { value: 3, label: "3★ & up" },
    { value: 2, label: "2★ & up" },
    { value: 1, label: "1★ & up" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-800">Rating</h3>
      <div className="space-y-2">
        {ratings.map((rating) => (
          <label key={rating.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={rating.value}
              checked={value === rating.value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700">{rating.label}</span>
          </label>
        ))}
      </div>
      {value && (
        <button
          onClick={() => onChange(undefined)}
          className="text-xs text-green-600 hover:text-green-700 underline"
        >
          Clear rating filter
        </button>
      )}
    </div>
  );
};

export default RatingFilter; 