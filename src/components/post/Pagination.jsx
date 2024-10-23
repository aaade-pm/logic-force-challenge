import PropTypes from "prop-types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
}) => {
  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        disabled={currentPage === 1}
        className="p-2 mx-1 border rounded"
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`p-2 mx-1 border rounded ${
            page === currentPage ? "bg-gray-200" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && totalPages > maxPageButtons && (
        <span className="p-2 mx-1">...</span>
      )}

      <button
        disabled={currentPage === totalPages}
        className="p-2 mx-1 border rounded"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  maxPageButtons: PropTypes.number,
};

export default Pagination;
