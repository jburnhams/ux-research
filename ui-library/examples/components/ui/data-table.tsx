import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// The table real product screens use: 12px muted sentence-case headers, row rules (no zebra),
// numbers right-aligned in tabular figures, one status mark and at most one action per row.
// Sortable headers are buttons and look sortable; aria-sort says which way. The scroll container is
// a labelled, focusable region so keyboard users can scroll a wide table.

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Right-aligns and sets tabular figures. Use for every quantity. */
  numeric?: boolean;
  sort?: (a: T, b: T) => number;
  /** Cells that may hold long text get truncated rather than stretching the table. */
  truncate?: boolean;
  className?: string;
};

type Sort = { key: string; dir: "ascending" | "descending" };

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  initialSort,
}: {
  /** Names the table for screen readers and labels the scroll region. */
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  initialSort?: Sort;
}) {
  const [sort, setSort] = React.useState<Sort | undefined>(initialSort);

  const sorted = React.useMemo(() => {
    const col = columns.find((c) => c.key === sort?.key);
    if (!sort || !col?.sort) return rows;
    const out = [...rows].sort(col.sort);
    return sort.dir === "descending" ? out.reverse() : out;
  }, [rows, columns, sort]);

  const toggle = (key: string) =>
    setSort((s) => ({ key, dir: s?.key === key && s.dir === "ascending" ? "descending" : "ascending" }));

  return (
    <div role="region" aria-label={caption} tabIndex={0} className="min-w-0 overflow-x-auto">
      <table className="w-full border-collapse type-body-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort?.key === c.key ? sort.dir : undefined;
              const Icon = active === "ascending" ? ArrowUp : active === "descending" ? ArrowDown : ArrowUpDown;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active}
                  className={cn("py-2 pr-4 text-left align-bottom type-caption text-muted-foreground last:pr-0", c.numeric && "text-right")}
                >
                  {c.sort ? (
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      className={cn(
                        "-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-control px-1 transition-state hover:text-foreground",
                        c.numeric && "flex-row-reverse",
                        active && "text-foreground",
                      )}
                    >
                      {c.header}
                      <Icon aria-hidden className={cn("size-3.5", !active && "opacity-50")} />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)} className="border-t border-border">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "py-2.5 pr-4 align-middle last:pr-0",
                    c.numeric && "text-right tabular-nums",
                    c.truncate && "max-w-48 truncate",
                    c.className,
                  )}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TableSkeleton({ rows = 4, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div aria-hidden className="grid gap-0">
      <div className="flex gap-4 py-2">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="h-3 flex-1 rounded-control bg-muted" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4 border-t border-border py-3.5">
          {Array.from({ length: columns }, (_, i) => (
            <div key={i} className="h-4 flex-1 rounded-control bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
