import { useState } from 'react';
import type { SortingState, PaginationState } from '@tanstack/react-table';

interface UseTableStateOptions {
  initialPageSize?: number;
}

/**
 * TanStack Table için ortak state yönetimi.
 * Sayfalama, sıralama ve global filtre durumunu yönetir.
 */
export function useTableState({ initialPageSize = 10 }: UseTableStateOptions = {}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const resetPagination = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    resetPagination();
  };

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter: handleGlobalFilterChange,
  };
}
