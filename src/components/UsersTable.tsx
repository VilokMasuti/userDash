import { UsersTableSkeleton } from '@/components/TableSkeleton'
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
import type { User } from '../../types'
import { defaultMeta } from '../lib/columnMeta'

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
              <div className="flex flex-wrap gap-1">
                {row.original.groups.map((g) => (
                  <Badge
                    key={g.id}
                    className="px-2 py-0.5 text-xs rounded-md bg-slate-50 shadow-md text-black"
                  >
                    {g.name} - {g.role}
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
                <Badge
                  className={
                    active
                      ? 'px-2 py-0.5 text-sm rounded-md bg-green-600 text-white'
                      : 'px-2 py-0.5 text-sm rounded-md bg-red-600 text-white'
                  }
                >
                  {active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    'px-2 py-0.5 text-sm rounded-md',
                    active
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-green-500 bg-green-50 text-green-600'
                  )}
                  onClick={() => onToggle(row.original)}
                >
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
