import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const UsersTableSkeleton = () => {
  return (
    <section className="p-4 md:p-6 min-h-screen">
      <Card className="shadow-sm border border-gray-200">
        {/* Header with filters */}

        {/* Table skeleton */}
        <CardContent className="p-0">
          <div className="rounded-md border border-gray-200">
            {/* Table header row */}
            <div className="grid grid-cols-[1.2fr_1.6fr_0.8fr_1fr_1.8fr_160px] items-center gap-4 px-4 py-3 bg-gray-50">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Table body rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.2fr_1.6fr_0.8fr_1fr_1.8fr_160px] items-center gap-4 border-t px-4 py-4"
              >
                {/* Name */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>

                {/* Email */}
                <Skeleton className="h-4 w-56" />

                {/* Status pill */}
                <Skeleton className="h-6 w-20 rounded-full" />

                {/* Joined date */}
                <Skeleton className="h-4 w-28" />

                {/* Groups chips */}
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Row actions */}
                <div className="flex items-center gap-2 justify-end">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
