import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex items-center space-x-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-sm font-medium transition-colors
              ${page === currentPage ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 hover:bg-green-50'}`}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
