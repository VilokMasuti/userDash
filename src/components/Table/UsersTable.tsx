import { UsersTableSkeleton } from '@/components/ui/TableSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo } from 'react'
import type { User } from '../../../types'
import { defaultMeta } from '.././../lib/columnMeta'

type StatusFilter = '' | 'active' | 'inactive'
type SortOption = 'newest' | 'oldest' | 'az' | 'za'

interface UsersTableProps {
  data: User[]
  total: number
  error: string
  loading: boolean
  query: string
  status: StatusFilter
  sorting: SortOption
  pagination: MRT_PaginationState
  onQueryChange: (val: string) => void
  onStatusChange: (val: StatusFilter) => void
  onSortingChange: (val: SortOption) => void
  onPaginationChange: (updater: any) => void
  onToggle: (user: User) => void
}

export default function UsersTable({
  data,
  total,
  error,
  loading,
  query,
  status,
  sorting,
  pagination,
  onQueryChange,
  onStatusChange,
  onSortingChange,
  onPaginationChange,
  onToggle
}: UsersTableProps) {
  const columns = useMemo<MRT_ColumnDef<User>[]>(() => {
    return defaultMeta.map((m) => {
      const baseColumn = {
        header: m.header,
        accessorKey: m.key,
        enableSorting: false,
        minSize: 100
      }

      if (m.key === 'groups') {
        return {
          ...baseColumn,
          Cell: ({ row }) =>
            row.original.groups?.length ? (
              <div className="flex flex-wrap gap-2">
                {row.original.groups.map((g) => (
                  <Badge
                    key={g.id}
                    className="px-3 py-1 text-xs font-medium rounded-full flex items-center gap-2
             bg-slate-100 text-gray-700 border border-gray-200 shadow-sm
             hover:bg-slate-100 hover:text-gray-700 dark:hover:bg-slate-100 dark:hover:text-gray-700"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="truncate">{g.name}</span>
                    <span className="text-gray-500 text-[11px]">
                      ({g.role})
                    </span>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">No groups</span>
            )
        }
      }

      if (m.key === 'status') {
        return {
          ...baseColumn,
          Cell: ({ row }) => {
            const active = row.original.status === 'active'
            return (
              <div className="flex items-center gap-2">
                {/* Badge */}
                <Badge
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 border shadow-sm',
                    active
                      ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-100 dark:hover:text-green-700'
                      : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-100 dark:hover:text-red-700'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      active ? 'bg-green-500' : 'bg-red-500'
                    )}
                  />
                  {active ? 'Active' : 'Inactive'}
                </Badge>

                {/* Toggle Button */}
                <Button
                  size="sm"
                  variant="outline" // keeps it neutral & modern
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-full border-gray-300"
                  onClick={() => onToggle(row.original)}
                >
                  <span
                    className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      active ? 'bg-red-500' : 'bg-green-500'
                    )}
                  />
                  {active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            )
          }
        }
      }

      return baseColumn
    })
  }, [onToggle])

  const table = useMaterialReactTable<User>({
    columns,
    data,
    state: { isLoading: loading, pagination },
    manualPagination: true,
    rowCount: total,
    onPaginationChange
  })

  return (
    <section className="p-4 md:p-6  min-h-screen">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200 pb-4">
          {/* Search + filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => {
                  onQueryChange(e.target.value)
                  onPaginationChange((p: any) => ({ ...p, pageIndex: 0 }))
                }}
                placeholder="Search users..."
                className="pl-10 w-64"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQueryChange('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <Select
              value={status || 'all'}
              onValueChange={(v: string) =>
                onStatusChange(v === 'all' ? '' : (v as StatusFilter))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Sorting */}
            <Select
              value={sorting}
              onValueChange={(v: SortOption) => onSortingChange(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="az">A–Z</SelectItem>
                <SelectItem value="za">Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : loading && data.length === 0 ? (
            <UsersTableSkeleton />
          ) : data.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No users found</div>
          ) : (
            <MaterialReactTable table={table} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
