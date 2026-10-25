import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  limit?: number;
  total?: number;
  onPageChange: (page: number) => void;
}

const control =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-ui-sm border border-line bg-surface px-3 text-sm text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50";

function pageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }
  if (currentPage >= totalPages - 2) {
    return Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
  }
  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

function Pagination({
  currentPage = 1,
  totalPages = 1,
  limit = 15,
  total = 0,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  const go = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav className="mt-8 space-y-4" aria-label="Pagination">
      <p className="text-center text-sm text-muted">
        Showing {start} to {end} of {total} items · {limit} per page · Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={control} aria-label="First page" disabled={currentPage === 1} onClick={() => go(1)}>
          <FaAngleDoubleLeft aria-hidden="true" />
        </button>
        <button type="button" className={control} aria-label="Previous page" disabled={currentPage === 1} onClick={() => go(currentPage - 1)}>
          <FaChevronLeft aria-hidden="true" />
        </button>
        {pageNumbers(currentPage, totalPages).map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === currentPage
                ? "inline-flex h-10 min-w-10 items-center justify-center rounded-ui-sm bg-primary px-3 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                : control
            }
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => go(page)}
          >
            {page}
          </button>
        ))}
        <button type="button" className={control} aria-label="Next page" disabled={currentPage === totalPages} onClick={() => go(currentPage + 1)}>
          <FaChevronRight aria-hidden="true" />
        </button>
        <button type="button" className={control} aria-label="Last page" disabled={currentPage === totalPages} onClick={() => go(totalPages)}>
          <FaAngleDoubleRight aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
