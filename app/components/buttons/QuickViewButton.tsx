"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";

interface QuickViewButtonProps {
  onClick: () => void;
  className?: string;
}

const QuickViewButton: React.FC<QuickViewButtonProps> = ({ onClick, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        data-quick-view="true"
        className={`bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center ${className}`}
      >
        <Eye className="w-4 h-4 text-gray-700" />
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-90 whitespace-nowrap z-10">
          Quick View
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default QuickViewButton; 