import { Skeleton } from './shadcn/Skeleton';

export default function UserSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-[100px]" />
    </>
  );
}
