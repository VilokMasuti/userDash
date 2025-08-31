import { Skeleton } from '@/components/ui/skeleton'

export const UsersTableSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="px-2">
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Toolbar: search, status filter, view controls */}
      <div className="flex flex-wrap items-center gap-3 px-2">
        <div className="flex-1 min-w-[220px]">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* Table header */}
      <div className="rounded-md border">
        <div className="grid grid-cols-[40px_1.2fr_1.6fr_0.8fr_0.9fr_1.8fr_160px] items-center gap-4 px-3 py-3">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        {/* Table body rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[40px_1.2fr_1.6fr_0.8fr_0.9fr_1.8fr_160px] items-center gap-4 border-t px-3 py-4"
          >
            {/* Checkbox */}
            <Skeleton className="h-4 w-4 rounded-sm" />

            {/* Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>

            {/* Email */}
            <Skeleton className="h-4 w-[260px]" />

            {/* Status pill */}
            <div className="flex items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Joined date */}
            <Skeleton className="h-4 w-20" />

            {/* Groups chips */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* Row actions */}
            <div className="ml-auto flex items-center justify-end gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
