import { Skeleton } from "@/components/ui/skeleton"

// Task 181: Meaningful skeletons instead of "Laden..." generic messages
export function TableSkeleton() {
  return (
    <div className="w-full space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>

      {/* Table Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 border-b py-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-[80px]" />
        </div>
      ))}
    </div>
  )
}
