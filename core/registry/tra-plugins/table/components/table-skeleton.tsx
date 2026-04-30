import { Skeleton } from '@/components/skeleton';

const TableSkeleton = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <>
    {!hideHeader && (
      <div className="grid grid-cols-4 items-center w-full gap-2 mb-8">
        <Skeleton className="h-12 mb-2" />
        <Skeleton className="h-12 mb-2" />
        <Skeleton className="h-12 mb-2" />
        <Skeleton className="h-12 mb-2" />
      </div>
    )}
    <Skeleton className="h-12 w-full rounded-b-none" />
    <Skeleton className="h-12 w-full rounded-none bg-disabled-light-dark border-b" />
    <Skeleton className="h-12 w-full rounded-none bg-disabled-light-dark border-b" />
    <Skeleton className="h-12 w-full rounded-none bg-disabled-light-dark border-b" />
    <Skeleton className="h-12 w-full rounded-none bg-disabled-light-dark border-b" />
    <Skeleton className="h-12 w-full rounded-none bg-disabled-light-dark border-b" />
    <Skeleton className="h-12 w-full rounded-none bg-disabled-light-dark border-b" />
  </>
);

export default TableSkeleton;
