import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTableState } from "@/hooks/useTableState";
import { TableSkeleton } from "./table-skeleton";
import { CustomTableFilterSection } from "./custom-table-filter-section";
import { cn } from "@/lib/utils";

interface CustomTableProps<TData> {
  /** Tablo verisi */
  data: TData[];
  /** TanStack Table ColumnDef dizisi */
  columns: ColumnDef<TData, unknown>[];
  /** Veri yüklenirken skeleton göster */
  isLoading?: boolean;
  /** Global arama göster */
  searchable?: boolean;
  /** Sayfalama göster */
  paginated?: boolean;
  /** Ek CSS sınıfı */
  className?: string;
}

/**
 * TanStack Table tabanlı genel amaçlı tablo component'i.
 * Sıralama, filtreleme ve sayfalama desteğiyle gelir.
 *
 * @example
 * <CustomTable
 *   columns={columns}
 *   data={users}
 *   isLoading={isLoading}
 *   searchable
 *   paginated
 * />
 */
export function CustomTable<TData>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  paginated = true,
  className,
}: CustomTableProps<TData>) {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
  } = useTableState();

  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting, globalFilter },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <TableSkeleton columns={columns.length} />;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {searchable && (
        <CustomTableFilterSection
          value={globalFilter}
          onChange={setGlobalFilter}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-left font-medium text-neutral-600 dark:text-neutral-300",
                      header.column.getCanSort() &&
                        "cursor-pointer select-none",
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-neutral-400"
                >
                  Veri bulunamadı
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-neutral-800 dark:text-neutral-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && (
        <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>Toplam {table.getFilteredRowModel().rows.length} kayıt</span>
          <div className="flex items-center gap-2">
            <button
              className="rounded px-2 py-1 hover:bg-neutral-100 disabled:opacity-40 dark:hover:bg-neutral-700"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Önceki
            </button>
            <span>
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <button
              className="rounded px-2 py-1 hover:bg-neutral-100 disabled:opacity-40 dark:hover:bg-neutral-700"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Sonraki →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
