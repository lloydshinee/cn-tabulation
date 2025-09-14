"use client";
import { Skeleton } from "./ui/skeleton";

export function UserLoading() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
