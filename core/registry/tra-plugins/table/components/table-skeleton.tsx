import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 5, rows = 8 }: TableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <th key={i} className="px-4 py-3">
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={rowIdx} className="bg-white dark:bg-neutral-900">
              {Array.from({ length: columns }).map((_, colIdx) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={colIdx} className="px-4 py-3">
                  <div
                    className={cn(
                      'h-4 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800',
                      colIdx === 0 ? 'w-32' : 'w-20',
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
