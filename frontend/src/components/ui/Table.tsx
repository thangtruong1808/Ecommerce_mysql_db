import type { ReactNode } from "react";
import { cn } from "./cn";
import { EmptyState } from "./EmptyState";

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  caption: string;
  getRowKey: (row: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}

function cellValue<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  if (value == null || value === "") {
    return "—";
  }
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return String(value);
}

export function Table<T>({
  columns,
  rows,
  caption,
  getRowKey,
  emptyTitle = "Nothing to show",
  emptyDescription,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-ui border border-line bg-surface">
      <table className="min-w-full border-collapse text-left text-sm text-ink">
        <caption className="px-4 py-3 text-left text-sm font-medium text-ink">
          {caption}
        </caption>
        <thead className="bg-surface-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-4 py-2 font-semibold text-ink",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-4" colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={getRowKey(row, index)} className="border-t border-line">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3 align-middle", column.className)}
                  >
                    {column.render ? column.render(row) : cellValue(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
