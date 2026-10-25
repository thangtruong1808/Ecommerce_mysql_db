import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { focusRing } from "../ui/styles";

const statusClass: Record<string, string> = {
  pending: "border-warning bg-warning/20 text-ink",
  processing: "border-info bg-info/15 text-info",
  paid: "border-success bg-success/15 text-success",
  delivered: "border-primary bg-primary/10 text-primary",
  cancelled: "border-danger bg-danger/15 text-danger",
  active: "border-success bg-success/15 text-success",
  inactive: "border-line bg-surface-muted text-ink",
  approved: "border-success bg-success/15 text-success",
  rejected: "border-danger bg-danger/15 text-danger",
};

interface StatusBadgeProps {
  currentStatus: string;
  availableStatuses?: string[];
  onStatusChange?: (status: string) => void;
  entityType?: string;
  loading?: boolean;
}

export default function StatusBadge({
  currentStatus,
  availableStatuses = [],
  onStatusChange,
  entityType = "order",
  loading = false,
}: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canChoose = availableStatuses.length > 1 && !loading;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handlePointer = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          if (canChoose) {
            setIsOpen((open) => !open);
          }
        }}
        disabled={loading}
        aria-busy={loading || undefined}
        aria-expanded={isOpen}
        aria-label={`Change ${entityType} status, currently ${currentStatus}`}
        className={`inline-flex items-center rounded-ui-sm border px-3 py-1 text-xs font-semibold capitalize ${statusClass[currentStatus] || "border-line bg-surface-muted text-ink"} ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} ${focusRing}`}
      >
        {loading ? (
          <svg className="mr-1 h-3 w-3 motion-safe:animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : null}
        <span>{currentStatus}</span>
        {canChoose ? <FaChevronDown className="ml-1 text-xs" aria-hidden="true" /> : null}
      </button>
      {isOpen && canChoose ? (
        <div className="absolute z-10 mt-1 min-w-[120px] rounded-ui-sm border border-line bg-surface shadow-ui">
          {availableStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                if (status !== currentStatus) {
                  onStatusChange?.(status);
                }
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm capitalize text-ink first:rounded-t-ui-sm last:rounded-b-ui-sm hover:bg-surface-muted ${focusRing} ${status === currentStatus ? "bg-primary/10 font-semibold" : ""}`}
            >
              {status}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
