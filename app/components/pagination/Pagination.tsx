import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex items-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7].map((page) => (
          <span
            key={page}
            className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-sm font-medium transition-colors
              ${page === 1 ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 hover:bg-green-50'}`}
          >
            {page}
          </span>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
