import React, { useMemo, useState } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  PaginationState,
  FilterFn,
  ExpandedState,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
  RowData,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useIsMobile } from '@/hooks/use-mobile';
import Pagination from '@/components/pagination';
import CustomTableFilterSection from './custom-table-filter-section';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    bodyClassName?: string;
    headerItemClassName?: string;
  }
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

const CustomTable = <T extends object>({
  data,
  columns,
  sorting,
  setSorting,
  hidePagination = false,
  renderExpandedRow,
  tableClassName,
  tableWrapperClassName,
  searchText,
  setSearchText,
  rowClassName,
  bodyRowClassName,
  expandKey,
  containerClassName,
  headCellClassName,
  bodyCellClassName,
  expandRowContainerClassName,
  onlyExpanded = false,
  filterColumns,
  headClassName = '',
  onFilteredDataChange,
  defaultPageSize = { desktop: 10, mobile: 8 },
}: {
  data: T[];
  columns: ColumnDef<T>[];
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  hidePagination?: boolean;
  renderExpandedRow?: (row: import('@tanstack/react-table').Row<T>) => React.ReactNode;
  tableClassName?: string;
  tableWrapperClassName?: string;
  searchText?: string;
  setSearchText?: React.Dispatch<React.SetStateAction<string>>;
  rowClassName?: (row: T) => string;
  bodyRowClassName?: string;
  expandKey?: string;
  containerClassName?: string;
  headCellClassName?: string;
  bodyCellClassName?: string;
  expandRowContainerClassName?: string;
  onlyExpanded?: boolean;
  headClassName?: string;
  filterColumns?: Array<
    | string
    | {
        id: string;
        label?: string;
        placeholder?: string;
        columns?: string[];
        path?: string | string[];
      }
  >;
  onFilteredDataChange?: (filteredData: T[]) => void;
  defaultPageSize?: { desktop: number; mobile: number };
}) => {
  const isMobile = useIsMobile();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: undefined as unknown as number,
  });
  // const [searchText, setSearchText] = useState('')

  React.useEffect(() => {
    const newPageSize = isMobile ? defaultPageSize.mobile : defaultPageSize.desktop;
    setPagination((prev) => {
      if (prev.pageSize !== newPageSize) {
        return { ...prev, pageSize: newPageSize };
      }
      return prev;
    });
  }, [isMobile, defaultPageSize]);

  const [expanded, setExpanded] = useState<ExpandedState>(onlyExpanded ? true : {});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const fuzzyFilter: FilterFn<T> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const normalizedFilterColumns = useMemo(
    () =>
      (filterColumns || []).map((fc) =>
        typeof fc === 'string'
          ? {
              id: fc,
              label: undefined as string | undefined,
              placeholder: undefined as string | undefined,
              columns: undefined as string[] | undefined,
              path: undefined as string | string[] | undefined,
            }
          : fc,
      ),
    [filterColumns],
  );

  const augmentedColumns: ColumnDef<T>[] = useMemo(() => {
    const existingIds = new Set(
      (columns || []).map(
        (c: ColumnDef<T>) =>
          ((c as { id?: string; accessorKey?: string }).id ??
            (c as { id?: string; accessorKey?: string }).accessorKey) as string,
      ),
    );
    const syntheticColumns: ColumnDef<T>[] = [];

    normalizedFilterColumns.forEach((fc) => {
      if (fc?.columns && fc.columns.length > 0) {
        if (!existingIds.has(fc.id)) {
          const synthetic: ColumnDef<T> = {
            id: fc.id,
            header: fc.label ?? fc.id,
            enableSorting: false,
            meta: { headerClassName: 'hidden', bodyClassName: 'hidden' } as Record<string, string>,
            accessorFn: (row: T) => {
              try {
                if (fc.path) {
                  const getNestedByPath = (obj: unknown, path: string | string[]): string => {
                    if (obj === null || obj === undefined) return '';
                    if (Array.isArray(path)) {
                      return path
                        .map((p) =>
                          p
                            .split('.')
                            .reduce(
                              (current: Record<string, unknown>, key: string) =>
                                current?.[key] as Record<string, unknown>,
                              obj as Record<string, unknown>,
                            ),
                        )
                        .filter((v) => v !== undefined && v !== null)
                        .join(' ');
                    }
                    return String(
                      (path as string)
                        .split('.')
                        .reduce(
                          (current: Record<string, unknown>, key: string) =>
                            current?.[key] as Record<string, unknown>,
                          obj as Record<string, unknown>,
                        ) ?? '',
                    );
                  };

                  return fc
                    .columns!.map((k) => {
                      const value = (row as Record<string, unknown>)[k];
                      if (Array.isArray(value)) {
                        return value
                          .map((item) => {
                            const nested = getNestedByPath(item, fc.path!);
                            return String(nested ?? '');
                          })
                          .join(' ');
                      }
                      const nested = getNestedByPath(value, fc.path!);
                      return String(nested ?? '');
                    })
                    .join(' ')
                    .trim();
                }
                return fc
                  .columns!.map((k) => String((row as Record<string, unknown>)[k] ?? ''))
                  .join(' ')
                  .trim();
              } catch {
                return '';
              }
            },
            cell: () => null,
          };
          syntheticColumns.push(synthetic);
        }
      }
    });

    return [...columns, ...syntheticColumns];
  }, [columns, normalizedFilterColumns]);

  React.useEffect(() => {
    const hidden: VisibilityState = {};
    augmentedColumns.forEach((c: ColumnDef<T>) => {
      const meta = c.meta as { bodyClassName?: string; headerClassName?: string } | undefined;
      const id =
        (c as { id?: string; accessorKey?: string }).id ??
        (c as { id?: string; accessorKey?: string }).accessorKey;
      if ((meta?.bodyClassName === 'hidden' || meta?.headerClassName === 'hidden') && id) {
        hidden[id] = false;
      }
    });
    setColumnVisibility((prev) => ({ ...prev, ...hidden }));
  }, [augmentedColumns]);

  const table = useReactTable({
    columns: augmentedColumns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: !hidePagination ? getPaginationRowModel() : undefined,
    onPaginationChange: !hidePagination ? setPagination : undefined,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
      expanded,
      globalFilter: searchText,
      columnFilters,
      columnVisibility,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    defaultColumn: {
      filterFn: 'fuzzy',
    },
    onGlobalFilterChange: setSearchText,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: 'fuzzy',
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    // autoResetPageIndex: false,
  });

  // Filtrelenmiş verileri parent component'e gönder
  React.useEffect(() => {
    if (onFilteredDataChange) {
      const filteredRows = table.getFilteredRowModel().rows.map((row) => row.original);
      onFilteredDataChange(filteredRows);
    }
  }, [searchText, columnFilters, data]);

  const hasExpandableContent = (original: T, key: string): boolean => {
    const record = original as Record<string, unknown>;
    const val = record[key];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  };

  return (
    <div className={cn('flex flex-col w-full gap-9 min-h-0 justify-between', containerClassName)}>
      <div className="flex flex-col gap-5">
        <CustomTableFilterSection
          table={table}
          normalizedFilterColumns={normalizedFilterColumns}
          data={data}
          augmentedColumns={
            augmentedColumns as unknown as { header: string; accessorKey?: string }[]
          }
        />
        <div
          className={cn('custom-table-container overflow-auto rounded-xl', tableWrapperClassName)}
        >
          <table className={cn('w-full border border-transparent', tableClassName)}>
            <thead className={cn(headClassName)}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      role="header-cell"
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-primary-15 text-start p-3.5 text-xxs md:text-xs font-medium',
                        headCellClassName,
                        header.column.columnDef.meta?.headerClassName as string,
                      )}
                    >
                      <div
                        {...{
                          className: cn(
                            'flex items-center gap-2',
                            header.column.columnDef.meta?.headerItemClassName as string,
                            header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          ),
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext()) as string}
                        {{
                          asc: <ChevronUp className="size-4" />,
                          desc: <ChevronDown className="size-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel()?.rows?.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr
                      className={cn(
                        'bg-primary-5 border-b border-neutral-white hover:brightness-110 transition-all',
                        bodyRowClassName,
                        rowClassName ? rowClassName(row.original) : undefined,
                      )}
                      onClick={
                        expandKey &&
                        !onlyExpanded &&
                        row.original &&
                        hasExpandableContent(row.original, expandKey)
                          ? () => row.toggleExpanded()
                          : undefined
                      }
                      style={
                        expandKey && row.original && hasExpandableContent(row.original, expandKey)
                          ? { cursor: 'pointer' }
                          : undefined
                      }
                    >
                      {row.getVisibleCells().map((cell, idx) => (
                        <td
                          key={cell.id}
                          role="body-cell"
                          className={cn(
                            'py-4 px-3.5 text-xxs md:text-xs font-normal',
                            bodyCellClassName,
                            cell.column.columnDef.meta?.bodyClassName as string,
                          )}
                        >
                          {idx === 0 && renderExpandedRow ? (
                            <span className="flex items-center">
                              {expandKey &&
                              !onlyExpanded &&
                              row.original &&
                              hasExpandableContent(row.original, expandKey) ? (
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    marginRight: 8,
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    row.toggleExpanded();
                                  }}
                                >
                                  <ChevronUp
                                    size={18}
                                    className={cn(
                                      'transition-all',
                                      row.getIsExpanded() ? 'rotate-0' : 'rotate-180',
                                    )}
                                  />
                                </span>
                              ) : (
                                <span className="w-5" />
                              )}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                    {/* Expanded row içeriği */}
                    {row.getIsExpanded() && renderExpandedRow && (
                      <tr className={cn('animate-grow-down', expandRowContainerClassName)}>
                        <td
                          colSpan={row.getVisibleCells().length}
                          style={{ background: 'transparent', paddingLeft: 0 }}
                          className="p-0"
                        >
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    className="pt-10 text-lg md:text-2xl"
                    align="center"
                    colSpan={table.getAllLeafColumns().length}
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!hidePagination && (
        <div className="flex justify-center">
          <Pagination
            mode="default"
            totalPages={table.getPageCount()}
            currentPage={table.getState().pagination.pageIndex + 1}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            maxVisiblePages={6}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTable;
