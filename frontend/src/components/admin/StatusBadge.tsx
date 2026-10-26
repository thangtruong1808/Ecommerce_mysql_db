import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Badge, type BadgeVariant } from "../ui";
import { focusRing } from "../ui/styles";

export function statusVariant(status: string | null | undefined): BadgeVariant {
  const value = (status || "").toLowerCase();
  if (value === "paid" || value === "delivered" || value === "succeeded" || value === "completed" || value === "active" || value === "approved") {
    return "success";
  }
  if (value === "processing") {
    return "info";
  }
  if (value === "pending" || value === "unpaid") {
    return "warning";
  }
  if (value === "cancelled" || value === "canceled" || value === "failed" || value === "rejected") {
    return "danger";
  }
  if (value === "admin") {
    return "primary";
  }
  if (value === "user") {
    return "info";
  }
  return "neutral";
}

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
        aria-haspopup="menu"
        aria-label={`Change ${entityType} status, currently ${currentStatus}`}
        className={`inline-flex items-center gap-1 rounded-full ${loading ? "cursor-not-allowed opacity-60" : ""} ${focusRing}`}
      >
        {loading ? (
          <svg className="h-3 w-3 motion-safe:animate-spin text-ink" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : null}
        <Badge variant={statusVariant(currentStatus)} className="capitalize">
          {currentStatus}
        </Badge>
        {canChoose ? <FaChevronDown className="text-xs text-muted" aria-hidden="true" /> : null}
      </button>
      {isOpen && canChoose ? (
        <div className="absolute left-0 z-20 mt-1 min-w-[9rem] rounded-ui border border-line bg-surface p-1 shadow-ui" role="menu">
          {availableStatuses.map((status) => (
            <button
              key={status}
              type="button"
              role="menuitem"
              onClick={() => {
                if (status !== currentStatus) {
                  onStatusChange?.(status);
                }
                setIsOpen(false);
              }}
              className={`flex w-full rounded-ui-sm px-2 py-1.5 text-left hover:bg-surface-muted ${focusRing} ${status === currentStatus ? "bg-surface-muted" : ""}`}
            >
              <Badge variant={statusVariant(status)} className="capitalize">
                {status}
              </Badge>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
