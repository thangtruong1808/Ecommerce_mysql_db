import { FaAngleDoubleLeft, FaAngleDoubleRight, FaCheck, FaChevronLeft, FaChevronRight, FaSort, FaSortDown, FaSortUp, FaTimes } from "react-icons/fa";
import { Button, Input, Select } from "../../components/ui";
import { focusRing } from "../../components/ui/styles";

const pagerButton =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-ui border border-line bg-surface px-3 font-ui text-sm font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50";

interface FilterOption {
  value: string;
  label: string;
}

interface ProductToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  searchPlaceholder: string;
}

export function ProductToolbar({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  searchPlaceholder,
}: ProductToolbarProps) {
  return (
    <div className="mb-4 grid min-w-0 gap-3 rounded-ui-lg border border-line bg-surface p-4 shadow-ui sm:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="relative min-w-0">
        <Input
          id="product-search"
          label="Search"
          type="search"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className={`absolute bottom-2.5 right-3 inline-flex h-6 w-6 items-center justify-center rounded-ui-sm text-muted hover:bg-surface-muted hover:text-ink ${focusRing}`}
            aria-label="Clear search"
          >
            <FaTimes aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <Select
        id="product-stock-filter"
        label="Stock"
        value={filterValue}
        options={filterOptions}
        onChange={(event) => onFilterChange(event.target.value)}
      />
    </div>
  );
}

interface ProductPageBarProps {
  position: "top" | "bottom";
  currentPage: number;
  totalPages: number;
  totalItems: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onEntriesChange: (value: number) => void;
}

export function ProductPageBar({
  position,
  currentPage,
  totalPages,
  totalItems,
  entriesPerPage,
  onPageChange,
  onEntriesChange,
}: ProductPageBarProps) {
  if (position === "top") {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
    const end = Math.min(currentPage * entriesPerPage, totalItems);
    return (
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:w-36">
          <Select
            id="product-page-size"
            label="Show"
            value={String(entriesPerPage)}
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            onChange={(event) => onEntriesChange(Number(event.target.value))}
          />
        </div>
        <p className="font-ui text-sm text-muted">
          {totalItems === 0 ? "Showing 0 entries" : `Showing ${start}-${end} of ${totalItems} entries`}
        </p>
      </div>
    );
  }

  if (totalItems === 0 || totalItems <= entriesPerPage) {
    return null;
  }

  return (
    <nav className="mt-4 flex flex-wrap items-center justify-center gap-2" aria-label="Products pagination">
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

interface ProductSortHeaderProps {
  label: string;
  field: string;
  currentSort: string;
  sortOrder: string;
  onSort: (field: string, order: string) => void;
}

export function ProductSortHeader({ label, field, currentSort, sortOrder, onSort }: ProductSortHeaderProps) {
  const active = currentSort === field;
  const nextOrder = active && sortOrder === "asc" ? "desc" : "asc";
  return (
    <th className="px-3 py-3 text-left">
      <button
        type="button"
        onClick={() => onSort(field, nextOrder)}
        className={`inline-flex items-center font-ui text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink ${focusRing}`}
      >
        {label}
        {active && sortOrder === "asc" ? (
          <FaSortUp className="ml-1 text-primary" aria-hidden="true" />
        ) : active ? (
          <FaSortDown className="ml-1 text-primary" aria-hidden="true" />
        ) : (
          <FaSort className="ml-1 text-muted" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}

export function ProductSelectBox({ pressed, label, onClick }: { pressed: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-ui-sm border-2 ${
        pressed ? "border-primary bg-primary text-on-primary" : "border-line bg-canvas text-transparent hover:border-primary"
      } ${focusRing}`}
    >
      <FaCheck className="h-2.5 w-2.5" aria-hidden="true" />
    </button>
  );
}

interface BulkAction {
  type: string;
  label: string;
  data?: { stock?: number };
}

export function ProductBulkBar({
  selectedCount,
  busy,
  actions,
  onAction,
  onCancel,
}: {
  selectedCount: number;
  busy: boolean;
  actions: BulkAction[];
  onAction: (actionType: string, data?: { stock?: number }) => void;
  onCancel: () => void;
}) {
  if (selectedCount === 0) {
    return null;
  }
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex w-[min(100%-1.5rem,40rem)] -translate-x-1/2 flex-col gap-3 rounded-ui-lg border border-line bg-surface px-4 py-3 text-ink shadow-ui-md sm:flex-row sm:items-center">
      <p className="font-ui text-sm font-semibold">
        {selectedCount} item{selectedCount === 1 ? "" : "s"} selected
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
        {actions.map((action) => (
          <Button
            key={action.type}
            type="button"
            size="sm"
            variant={action.type === "delete" ? "danger" : "outline"}
            loading={busy}
            onClick={() => onAction(action.type, action.data)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={busy}>
        Cancel
      </Button>
    </div>
  );
}
