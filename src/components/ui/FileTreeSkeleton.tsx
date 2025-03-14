import { Skeleton } from './shadcn/Skeleton';

export default function FileListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[220px]" />
      </div>
      <div className="flex items-center space-x-2 pl-6">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[190px]" />
      </div>
    </div>
  );
}
