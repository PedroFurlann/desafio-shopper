import { CaretLeft, CaretRight } from 'phosphor-react';
import React, { useState } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage = 5,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const visiblePages = () => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className="hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <CaretLeft color='#059669' weight='bold' size={24} />
      </button>

      {visiblePages().map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-full ${currentPage === page
            ? 'border-2 bg-white text-emerald-600 font-bold'
            : 'text-white font-bold bg-transparent'
            }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <CaretRight color='#059669' weight='bold' size={24} />
      </button>
    </div>
  );
};

export default Pagination;