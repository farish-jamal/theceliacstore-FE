import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always show first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add the calculated range
    rangeWithDots.push(...range);

    // Always show last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center mt-8 px-4">
      <nav className="inline-flex items-center space-x-1 max-w-full overflow-hidden">
        {/* Previous button */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-green-50"
            aria-label="Previous page"
          >
            ‹
          </button>
        )}

        {/* Page numbers */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-sm font-medium transition-colors
                ${pageNumber === currentPage 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next button */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-green-50"
            aria-label="Next page"
          >
            ›
          </button>
        )}
      </nav>
    </div>
  );
};

export default Pagination;
