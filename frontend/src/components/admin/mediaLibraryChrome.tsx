import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const pagerButton =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-ui border border-line bg-surface px-3 font-ui text-sm font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50";

export function MediaPageBar({
  currentPage,
  totalPages,
  label,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  label: string;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <nav className="mt-4 flex flex-wrap items-center justify-center gap-2" aria-label={label}>
      <button type="button" className={pagerButton} aria-label="First page" disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        <FaAngleDoubleLeft aria-hidden="true" />
      </button>
      <button type="button" className={pagerButton} aria-label="Previous page" disabled={currentPage === 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))}>
        <FaChevronLeft aria-hidden="true" />
      </button>
      <span className="px-2 font-ui text-sm text-muted">
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" className={pagerButton} aria-label="Next page" disabled={currentPage === totalPages} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>
        <FaChevronRight aria-hidden="true" />
      </button>
      <button type="button" className={pagerButton} aria-label="Last page" disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
        <FaAngleDoubleRight aria-hidden="true" />
      </button>
    </nav>
  );
}
