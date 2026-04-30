import type { Table, ColumnDef, RowData } from '@tanstack/react-table';

interface NormalizedFilterColumn {
  id: string;
  label?: string;
  placeholder?: string;
  columns?: string[];
  path?: string | string[];
}

interface CustomTableFilterSectionProps<TData extends RowData> {
  table: Table<TData>;
  normalizedFilterColumns: NormalizedFilterColumn[];
  data: TData[];
  augmentedColumns: ColumnDef<TData>[];
  placeholder?: string;
}

export function CustomTableFilterSection<TData extends RowData>({
  table,
  normalizedFilterColumns,
  placeholder = 'Ara...',
}: CustomTableFilterSectionProps<TData>) {
  const globalFilter = (table.getState().globalFilter as string) ?? '';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
      />

      {normalizedFilterColumns.map((fc) => {
        const columnFilter = table.getState().columnFilters.find((f) => f.id === fc.id);
        const filterValue = (columnFilter?.value as string) ?? '';

        return (
          <input
            key={fc.id}
            type="text"
            value={filterValue}
            onChange={(e) => table.getColumn(fc.id)?.setFilterValue(e.target.value || undefined)}
            placeholder={fc.placeholder ?? fc.label ?? fc.id}
            className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        );
      })}
    </div>
  );
}
