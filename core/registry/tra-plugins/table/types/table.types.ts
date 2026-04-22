export interface TableColumn<TData> {
  /** TanStack accessorKey veya id */
  key: string;
  header: string;
  /** Hücre render fonksiyonu — belirtilmezse ham değer gösterilir */
  cell?: (value: unknown, row: TData) => React.ReactNode;
  /** Sıralama aktif mi? Varsayılan: true */
  sortable?: boolean;
  /** Minimum kolon genişliği (px) */
  minWidth?: number;
}

export interface TableState {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  globalFilter: string;
}

export interface PaginationMeta {
  totalCount: number;
  pageCount: number;
}
