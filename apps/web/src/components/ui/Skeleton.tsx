import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-slate-200", className)} />
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}